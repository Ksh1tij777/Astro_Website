import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import {
  emptyFragments,
  namesMatch,
  normalizeTeamName,
  publicTeamState,
  teamsCollection,
  type TeamRecord,
} from '@/lib/teams';
import { generateTeamCode } from '@/lib/scoring';

const MAX_CODE_ATTEMPTS = 5;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const rawName = typeof body.teamName === 'string' ? body.teamName : '';
  const teamCode = typeof body.teamCode === 'string' ? body.teamCode.trim().toUpperCase() : '';

  const teamName = normalizeTeamName(rawName);
  if (!teamName) {
    return NextResponse.json({ error: 'Team name is required.' }, { status: 400 });
  }

  const collection = teamsCollection();

  // --- Resume with an existing code -------------------------------------
  if (teamCode) {
    const snap = await collection.doc(teamCode).get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'That team code was not found.' }, { status: 404 });
    }
    const team = snap.data() as TeamRecord;
    if (!namesMatch(team.teamName, teamName)) {
      return NextResponse.json({ error: 'Team name and code do not match.' }, { status: 401 });
    }
    await collection.doc(teamCode).update({ lastActive: FieldValue.serverTimestamp() });
    return NextResponse.json(publicTeamState(team));
  }

  // --- Register a new team ------------------------------------------------
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const code = generateTeamCode();
    const ref = collection.doc(code);
    try {
      await ref.create({
        teamName,
        teamCode: code,
        createdAt: FieldValue.serverTimestamp(),
        startedAt: FieldValue.serverTimestamp(),
        fragments: emptyFragments(),
        coordinatesVerified: false,
        hints: [],
        corrections: [],
        finished: false,
        finishedAt: null,
        lastActive: FieldValue.serverTimestamp(),
      });
      const snap = await ref.get();
      const team = snap.data() as TeamRecord;
      return NextResponse.json(publicTeamState(team));
    } catch {
      // Doc already existed (extremely unlikely collision) — retry with a new code.
      continue;
    }
  }

  return NextResponse.json({ error: 'Could not generate a unique team code — try again.' }, { status: 500 });
}
