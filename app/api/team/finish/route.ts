import { NextResponse } from 'next/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getDb } from '@/lib/firebaseAdmin';
import { publicTeamState, scoreForTeam, teamsCollection, type TeamRecord } from '@/lib/teams';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const teamCode = typeof body.teamCode === 'string' ? body.teamCode.trim().toUpperCase() : '';

  if (!teamCode) {
    return NextResponse.json({ error: 'teamCode is required.' }, { status: 400 });
  }

  const ref = teamsCollection().doc(teamCode);
  const db = getDb();

  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return { kind: 'not-found' as const };
    const team = snap.data() as TeamRecord;

    // Already finished — idempotent, return the frozen result unchanged.
    if (team.finished) return { kind: 'ok' as const, team };

    const { status } = scoreForTeam(team);
    if (status === 'expired') return { kind: 'expired' as const };

    const finishedAt = Timestamp.now();
    tx.update(ref, { finished: true, finishedAt, lastActive: FieldValue.serverTimestamp() });
    team.finished = true;
    team.finishedAt = finishedAt;
    return { kind: 'ok' as const, team };
  });

  if (result.kind === 'not-found') {
    return NextResponse.json({ error: 'That team code was not found.' }, { status: 404 });
  }
  if (result.kind === 'expired') {
    return NextResponse.json({ error: 'The 90-minute challenge window has closed for this team.' }, { status: 409 });
  }

  return NextResponse.json(publicTeamState(result.team));
}
