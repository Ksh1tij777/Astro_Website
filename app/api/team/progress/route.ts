import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getDb } from '@/lib/firebaseAdmin';
import { isLocked } from '@/lib/scoring';
import { FRAGMENT_IDS, publicTeamState, scoreForTeam, teamsCollection, type FragmentId, type TeamRecord } from '@/lib/teams';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const teamCode = typeof body.teamCode === 'string' ? body.teamCode.trim().toUpperCase() : '';
  const event = body.event;
  const fragmentId = body.fragmentId;

  if (!teamCode) {
    return NextResponse.json({ error: 'teamCode is required.' }, { status: 400 });
  }
  if (event !== 'fragment' || !FRAGMENT_IDS.includes(fragmentId)) {
    return NextResponse.json({ error: 'Unsupported progress event.' }, { status: 400 });
  }

  const ref = teamsCollection().doc(teamCode);
  const db = getDb();

  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return null;
    const team = snap.data() as TeamRecord;

    const { status } = scoreForTeam(team);
    // Locked (finished/expired) or already-collected fragments are no-ops —
    // the team's state is returned unchanged either way.
    if (!isLocked(status) && !team.fragments[fragmentId as FragmentId]) {
      tx.update(ref, {
        [`fragments.${fragmentId}`]: true,
        lastActive: FieldValue.serverTimestamp(),
      });
      team.fragments = { ...team.fragments, [fragmentId as FragmentId]: true };
    }
    return team;
  });

  if (!result) {
    return NextResponse.json({ error: 'That team code was not found.' }, { status: 404 });
  }

  return NextResponse.json(publicTeamState(result));
}
