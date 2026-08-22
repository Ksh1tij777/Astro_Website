import { NextResponse } from 'next/server';
import { adminTeamState, teamsCollection, type TeamRecord } from '@/lib/teams';

export const dynamic = 'force-dynamic';

export async function GET() {
  const snap = await teamsCollection().get();
  const teams = snap.docs.map((d) => adminTeamState(d.data() as TeamRecord));

  // Unfinished/active teams first, then by score descending — keeps the
  // teams still playing at the top where organizers are watching.
  teams.sort((a, b) => {
    const aDone = a.status !== 'active';
    const bDone = b.status !== 'active';
    if (aDone !== bDone) return aDone ? 1 : -1;
    return b.score - a.score;
  });

  return NextResponse.json({ teams });
}
