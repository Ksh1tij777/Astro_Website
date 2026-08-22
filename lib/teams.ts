import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getDb } from './firebaseAdmin';
import { computeScore, type CorrectionEntry, type HintEntry, type ScoreResult } from './scoring';

export const FRAGMENT_IDS = ['first', 'second', 'third', 'fourth'] as const;
export type FragmentId = (typeof FRAGMENT_IDS)[number];

export interface StoredHint {
  type: 'hard' | 'easy';
  penalty: number;
  note: string | null;
  at: Timestamp;
}

export interface StoredCorrection {
  adjustment: number;
  note: string;
  at: Timestamp;
}

export interface TeamRecord {
  teamName: string;
  teamCode: string;
  createdAt: Timestamp;
  startedAt: Timestamp;
  fragments: Record<FragmentId, boolean>;
  coordinatesVerified: boolean;
  hints: StoredHint[];
  corrections: StoredCorrection[];
  finished: boolean;
  finishedAt: Timestamp | null;
  lastActive: Timestamp;
}

export function teamsCollection() {
  return getDb().collection('teams');
}

export function normalizeTeamName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

function namesMatch(a: string, b: string): boolean {
  return normalizeTeamName(a).toLowerCase() === normalizeTeamName(b).toLowerCase();
}

export { namesMatch };

export function emptyFragments(): Record<FragmentId, boolean> {
  return { first: false, second: false, third: false, fourth: false };
}

function toHintEntries(hints: StoredHint[]): HintEntry[] {
  return hints.map((h) => ({ type: h.type, penalty: h.penalty, note: h.note, at: h.at.toMillis() }));
}

function toCorrectionEntries(corrections: StoredCorrection[]): CorrectionEntry[] {
  return corrections.map((c) => ({ adjustment: c.adjustment, note: c.note, at: c.at.toMillis() }));
}

export function scoreForTeam(team: TeamRecord, now?: number): ScoreResult {
  return computeScore({
    startedAtMs: team.startedAt.toMillis(),
    finishedAtMs: team.finishedAt ? team.finishedAt.toMillis() : null,
    finished: team.finished,
    hints: toHintEntries(team.hints ?? []),
    corrections: toCorrectionEntries(team.corrections ?? []),
    now,
  });
}

/** Shape returned to the team's own client — no admin-only internals. */
export function publicTeamState(team: TeamRecord) {
  const score = scoreForTeam(team);
  return {
    teamCode: team.teamCode,
    teamName: team.teamName,
    fragments: team.fragments,
    coordinatesVerified: team.coordinatesVerified,
    finished: team.finished,
    finishedAt: team.finishedAt ? team.finishedAt.toMillis() : null,
    status: score.status,
    score: score.score,
    elapsedMinutes: score.elapsedMinutes,
    timePenalty: score.timePenalty,
    hintPenalty: score.hintPenalty,
    hintsUsed: team.hints?.length ?? 0,
  };
}

/** Shape returned to the admin dashboard — full breakdown. */
export function adminTeamState(team: TeamRecord) {
  const score = scoreForTeam(team);
  return {
    teamCode: team.teamCode,
    teamName: team.teamName,
    fragments: team.fragments,
    coordinatesVerified: team.coordinatesVerified,
    finished: team.finished,
    finishedAt: team.finishedAt ? team.finishedAt.toMillis() : null,
    lastActive: team.lastActive ? team.lastActive.toMillis() : null,
    status: score.status,
    score: score.score,
    elapsedMinutes: score.elapsedMinutes,
    timePenalty: score.timePenalty,
    hardCount: score.hardCount,
    easyCount: score.easyCount,
    hintPenalty: score.hintPenalty,
    correctionsTotal: score.correctionsTotal,
    hints: (team.hints ?? []).map((h) => ({ type: h.type, penalty: h.penalty, note: h.note, at: h.at.toMillis() })),
    corrections: (team.corrections ?? []).map((c) => ({ adjustment: c.adjustment, note: c.note, at: c.at.toMillis() })),
  };
}

export const touchLastActive = () => FieldValue.serverTimestamp();
