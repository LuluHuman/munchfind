const STORAGE_KEY = "mf_rolls";
const WINDOW_MS = 60 * 60 * 1000;

export const MAX_ROLLS = 10;

type RollState = {
  count: number;
  expiresAt: number;
};

function freshState(): RollState {
  return { count: 0, expiresAt: Date.now() + WINDOW_MS };
}

function readState(): RollState {
  if (typeof window === "undefined") return freshState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();

    const parsed = JSON.parse(raw) as RollState;
    if (Date.now() > parsed.expiresAt) return freshState();

    return parsed;
  } catch {
    return freshState();
  }
}

function writeState(state: RollState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export type RollResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function consumeRoll(): RollResult {
  const state = readState();

  if (state.count >= MAX_ROLLS) {
    return { allowed: false, remaining: 0, resetAt: state.expiresAt };
  }

  const next: RollState = { count: state.count + 1, expiresAt: state.expiresAt };
  writeState(next);

  return { allowed: true, remaining: MAX_ROLLS - next.count, resetAt: next.expiresAt };
}
