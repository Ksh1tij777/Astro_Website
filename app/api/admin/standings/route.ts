import { NextResponse } from 'next/server';
import { adminTeamState, teamsCollection, type TeamRecord } from '@/lib/teams';

export const dynamic = 'force-dynamic';

export async function GET() {
  const snap = await teamsCollection().get();
  const teams = snap.docs.map((d) => adminTeamState(d.data() as TeamRecord)).filter((t) => t.status === 'finished');

  // Ranking: higher score first; tie -> earlier finishedAt; still tied -> teamCode.
  teams.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aAt = a.finishedAt ?? Infinity;
    const bAt = b.finishedAt ?? Infinity;
    if (aAt !== bAt) return aAt - bAt;
    return a.teamCode.localeCompare(b.teamCode);
  });

  const ranked = teams.map((t, i) => ({ rank: i + 1, ...t }));
  return NextResponse.json({ standings: ranked });
}
