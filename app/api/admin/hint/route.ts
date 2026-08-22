import { NextResponse } from 'next/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getDb } from '@/lib/firebaseAdmin';
import { hintPenaltyFor, isLocked, type HintType } from '@/lib/scoring';
import { adminTeamState, scoreForTeam, teamsCollection, type TeamRecord } from '@/lib/teams';

function isHintType(v: unknown): v is HintType {
  return v === 'hard' || v === 'easy';
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const teamCode = typeof body.teamCode === 'string' ? body.teamCode.trim().toUpperCase() : '';
  const type = body.type;
  const note = typeof body.note === 'string' && body.note.trim() ? body.note.trim() : null;

  if (!teamCode) {
    return NextResponse.json({ error: 'teamCode is required.' }, { status: 400 });
  }
  if (!isHintType(type)) {
    return NextResponse.json({ error: "type must be 'hard' or 'easy'." }, { status: 400 });
  }

  const ref = teamsCollection().doc(teamCode);
  const db = getDb();

  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return { kind: 'not-found' as const };
    const team = snap.data() as TeamRecord;

    const { status } = scoreForTeam(team);
    if (isLocked(status)) return { kind: 'locked' as const };

    const entry = { type, penalty: hintPenaltyFor(type), note, at: Timestamp.now() };
    tx.update(ref, {
      hints: FieldValue.arrayUnion(entry),
      lastActive: FieldValue.serverTimestamp(),
    });
    team.hints = [...(team.hints ?? []), entry];
    return { kind: 'ok' as const, team };
  });

  if (result.kind === 'not-found') {
    return NextResponse.json({ error: 'That team code was not found.' }, { status: 404 });
  }
  if (result.kind === 'locked') {
    return NextResponse.json({ error: 'Team is finished or time-expired — cannot log a hint.' }, { status: 409 });
  }

  return NextResponse.json(adminTeamState(result.team));
}
