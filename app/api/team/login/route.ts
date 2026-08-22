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

// Firestore/gRPC's ALREADY_EXISTS status — the only error a code collision
// should ever surface as. Anything else (bad credentials, missing database,
// permission-denied, ...) is a real failure and must not be retried/hidden
// behind a generic "try again".
function isAlreadyExists(err: unknown): boolean {
  const code = (err as { code?: number | string })?.code;
  return code === 6 || code === 'already-exists';
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const rawName = typeof body.teamName === 'string' ? body.teamName : '';
  const teamCode = typeof body.teamCode === 'string' ? body.teamCode.trim().toUpperCase() : '';

  const teamName = normalizeTeamName(rawName);
  if (!teamName) {
    return NextResponse.json({ error: 'Team name is required.' }, { status: 400 });
  }

  try {
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
    let lastError: unknown = null;
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
      } catch (err) {
        if (isAlreadyExists(err)) {
          // Doc already existed (extremely unlikely collision) — retry with a new code.
          lastError = err;
          continue;
        }
        // A real failure (bad credentials, Firestore not enabled, etc.) —
        // surface it instead of masking it behind five silent retries.
        throw err;
      }
    }

    console.error('team/login: exhausted code attempts', lastError);
    return NextResponse.json({ error: 'Could not generate a unique team code — try again.' }, { status: 500 });
  } catch (err) {
    console.error('team/login failed:', err);
    const message = err instanceof Error ? err.message : 'Unknown server error.';
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}
