import { randomInt } from 'crypto';
import {
  START_SCORE,
  FREE_MINUTES,
  CHALLENGE_MINUTES,
  MAX_TIME_PENALTY,
  HARD_HINT_PENALTY,
  EASY_HINT_PENALTY,
} from './scoringConstants';

export { START_SCORE, FREE_MINUTES, CHALLENGE_MINUTES, MAX_TIME_PENALTY, HARD_HINT_PENALTY, EASY_HINT_PENALTY };

export type HintType = 'hard' | 'easy';
export type TeamStatus = 'active' | 'finished' | 'expired';

export interface HintEntry {
  type: HintType;
  penalty: number;
  note: string | null;
  at: number; // ms epoch
}

export interface CorrectionEntry {
  adjustment: number;
  note: string;
  at: number; // ms epoch
}

export interface ScoreInput {
  startedAtMs: number;
  finishedAtMs: number | null;
  finished: boolean;
  hints: HintEntry[];
  corrections?: CorrectionEntry[];
  now?: number; // injectable for tests; defaults to Date.now()
}

export interface ScoreResult {
  status: TeamStatus;
  elapsedMinutes: number;
  /** Precise elapsed time in whole seconds — for display/ticking only.
   *  Never use this for penalty math; elapsedMinutes (floored to whole
   *  minutes) is the one true input to the time-penalty rule. */
  elapsedSeconds: number;
  timePenalty: number;
  hardCount: number;
  easyCount: number;
  hintPenalty: number;
  correctionsTotal: number;
  score: number;
}

/**
 * The one place time-penalty boundaries, hint costs, and the final-score
 * formula are defined. Every route that needs a score imports this instead
 * of recomputing it, so the ":01" minute boundary can't drift between
 * call sites — see the plan's "Server as the absolute scoring authority".
 */
export function computeScore(input: ScoreInput): ScoreResult {
  const now = input.now ?? Date.now();
  const end = input.finished && input.finishedAtMs != null ? input.finishedAtMs : now;

  const elapsedSeconds = Math.max(0, Math.floor((end - input.startedAtMs) / 1000));
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const timePenalty = Math.min(MAX_TIME_PENALTY, Math.max(0, elapsedMinutes - FREE_MINUTES));

  const hardCount = input.hints.filter((h) => h.type === 'hard').length;
  const easyCount = input.hints.filter((h) => h.type === 'easy').length;
  const hintPenalty = hardCount * HARD_HINT_PENALTY + easyCount * EASY_HINT_PENALTY;

  const correctionsTotal = (input.corrections ?? []).reduce((sum, c) => sum + c.adjustment, 0);

  const raw = START_SCORE - timePenalty - hintPenalty + correctionsTotal;
  const score = Math.max(0, raw);

  const status: TeamStatus = input.finished ? 'finished' : elapsedMinutes >= CHALLENGE_MINUTES ? 'expired' : 'active';

  return { status, elapsedMinutes, elapsedSeconds, timePenalty, hardCount, easyCount, hintPenalty, correctionsTotal, score };
}

/** True once a team can no longer be mutated by normal (non-correction) writes. */
export function isLocked(status: TeamStatus): boolean {
  return status === 'finished' || status === 'expired';
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
const CODE_LENGTH = 6;

export function generateTeamCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
}

export function hintPenaltyFor(type: HintType): number {
  return type === 'hard' ? HARD_HINT_PENALTY : EASY_HINT_PENALTY;
}
