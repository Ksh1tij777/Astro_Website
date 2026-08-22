// Pure constants, safe to import from client components (no Node built-ins).
// lib/scoring.ts re-exports these for server-side use alongside computeScore().
export const START_SCORE = 100;
export const FREE_MINUTES = 30;
export const CHALLENGE_MINUTES = 90;
export const MAX_TIME_PENALTY = CHALLENGE_MINUTES - FREE_MINUTES;
export const HARD_HINT_PENALTY = 5;
export const EASY_HINT_PENALTY = 15;
