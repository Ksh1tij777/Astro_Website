import { NextResponse } from 'next/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getDb } from '@/lib/firebaseAdmin';
import { adminTeamState, teamsCollection, type TeamRecord } from '@/lib/teams';

// The only route allowed to touch a finished/expired team's score — a
// deliberate, note-required, always-logged admin action for genuine
// post-hoc fixes. Never used by the two normal hint buttons.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const teamCode = typeof body.teamCode === 'string' ? body.teamCode.trim().toUpperCase() : '';
  const adjustment = Number(body.adjustment);
  const note = typeof body.note === 'string' ? body.note.trim() : '';

  if (!teamCode) {
    return NextResponse.json({ error: 'teamCode is required.' }, { status: 400 });
  }
  if (!Number.isFinite(adjustment) || adjustment === 0) {
    return NextResponse.json({ error: 'adjustment must be a non-zero number.' }, { status: 400 });
  }
  if (!note) {
    return NextResponse.json({ error: 'A note is required for every correction.' }, { status: 400 });
  }

  const ref = teamsCollection().doc(teamCode);
  const db = getDb();

  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return null;
    const team = snap.data() as TeamRecord;

    const entry = { adjustment, note, at: Timestamp.now() };
    tx.update(ref, {
      corrections: FieldValue.arrayUnion(entry),
      lastActive: FieldValue.serverTimestamp(),
    });
    team.corrections = [...(team.corrections ?? []), entry];
    return team;
  });

  if (!result) {
    return NextResponse.json({ error: 'That team code was not found.' }, { status: 404 });
  }

  return NextResponse.json(adminTeamState(result));
}
