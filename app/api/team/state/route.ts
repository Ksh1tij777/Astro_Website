import { NextResponse } from 'next/server';
import { publicTeamState, teamsCollection, type TeamRecord } from '@/lib/teams';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teamCode = (searchParams.get('teamCode') ?? '').trim().toUpperCase();

  if (!teamCode) {
    return NextResponse.json({ error: 'teamCode is required.' }, { status: 400 });
  }

  const snap = await teamsCollection().doc(teamCode).get();
  if (!snap.exists) {
    return NextResponse.json({ error: 'That team code was not found.' }, { status: 404 });
  }

  const team = snap.data() as TeamRecord;
  return NextResponse.json(publicTeamState(team));
}
