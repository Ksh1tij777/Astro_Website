import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getDb } from '@/lib/firebaseAdmin';
import { isLocked } from '@/lib/scoring';
import { scoreForTeam, teamsCollection, type TeamRecord } from '@/lib/teams';

// The expected answers live on the SERVER only — this file never ships to the
// browser, so the coordinates can't be read from DevTools / the debugger.
// For a public repo, override these via environment variables (set them in the
// Vercel dashboard, not in code) so the answer isn't visible on GitHub either.
const EXPECTED_RA = process.env.COORD_RA ?? '10H 45M';
const EXPECTED_LAT = Number(process.env.COORD_LAT ?? '26.936339');
const EXPECTED_LNG = Number(process.env.COORD_LNG ?? '75.923260');
const TOLERANCE = 0.02; // degrees of slack on the lat/long

// Reduce an RA string to just its digits so spacing/case/symbols don't matter:
// "10H 45M", "10h45m", "10 45", "10:45" all become "1045".
const digitsOnly = (s: string) => s.replace(/[^0-9]/g, '');

export async function POST(req: Request) {
  const { ra = '', dec = '', teamCode = '' } = await req.json().catch(() => ({}));

  const raOk = digitsOnly(String(ra)) === digitsOnly(EXPECTED_RA);

  const nums = (String(dec).match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
  const decOk =
    nums.length >= 2 &&
    Math.abs(nums[0] - EXPECTED_LAT) <= TOLERANCE &&
    Math.abs(nums[1] - EXPECTED_LNG) <= TOLERANCE;

  const ok = raOk && decOk;

  // Record the milestone server-side, but never let it touch a locked
  // (finished/expired) team's state.
  const code = String(teamCode).trim().toUpperCase();
  if (ok && code) {
    const ref = teamsCollection().doc(code);
    const db = getDb();
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return;
      const team = snap.data() as TeamRecord;
      const { status } = scoreForTeam(team);
      if (isLocked(status)) return;
      tx.update(ref, { coordinatesVerified: true, lastActive: FieldValue.serverTimestamp() });
    });
  }

  return NextResponse.json({ ok });
}
