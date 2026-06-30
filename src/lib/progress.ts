import type { ProgressState } from "./types";

export const PROGRESS_STORAGE_KEY = "one-chicago-roster-progress";

export const DEFAULT_PROGRESS: ProgressState = {
  watchedOrders: [],
  lastWatched: 0,
};

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;

  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      watchedOrders: Array.isArray(parsed.watchedOrders) ? parsed.watchedOrders : [],
      lastWatched: typeof parsed.lastWatched === "number" ? parsed.lastWatched : 0,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
}

export function toggleWatched(state: ProgressState, order: number): ProgressState {
  const watched = new Set(state.watchedOrders);
  if (watched.has(order)) {
    watched.delete(order);
  } else {
    watched.add(order);
  }

  const watchedOrders = [...watched].sort((a, b) => a - b);
  const lastWatched =
    watched.has(order) && order > state.lastWatched ? order : state.lastWatched;

  return { watchedOrders, lastWatched };
}

export function markVisibleWatched(
  state: ProgressState,
  orders: number[],
): ProgressState {
  const watched = new Set(state.watchedOrders);
  for (const order of orders) watched.add(order);
  const watchedOrders = [...watched].sort((a, b) => a - b);
  const lastWatched = Math.max(state.lastWatched, ...orders);
  return { watchedOrders, lastWatched };
}

export function isWatched(state: ProgressState, order: number): boolean {
  return state.watchedOrders.includes(order);
}

export function getResumeOrder(
  state: ProgressState,
  allOrders: number[],
): number | null {
  const sorted = [...allOrders].sort((a, b) => a - b);
  const watched = new Set(state.watchedOrders);

  for (const order of sorted) {
    if (!watched.has(order)) return order;
  }

  return null;
}
