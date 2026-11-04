import type { MonitorGap } from "./contract.ts";

/**
 * Events a backend lost before they reached this site. No Node APIs here: the server store and the
 * dashboard in the browser both use it.
 */

/**
 * Adds a gap unless one already known covers it. The backend reports a loss twice, as a
 * `monitor.gap` event and as the `gap` of the next delivery, and that `gap` grows when two prunes
 * happen before the site hears of them: a gap that covers others replaces them, so nothing is counted twice.
 */
export function addGap(gaps: readonly MonitorGap[], gap: MonitorGap): MonitorGap[] {
  const covers = (a: MonitorGap, b: MonitorGap) => a.fromSeq <= b.fromSeq && a.toSeq >= b.toSeq && a.count >= b.count;
  if (gaps.some((known) => covers(known, gap))) return [...gaps];
  return [...gaps.filter((known) => !covers(gap, known)), gap].sort((a, b) => a.fromSeq - b.fromSeq);
}

/** Events lost in total, and the positions they fall in. */
export function lostEvents(gaps: readonly MonitorGap[]): { count: number; fromSeq: number; toSeq: number } | null {
  if (gaps.length === 0) return null;
  return { count: gaps.reduce((n, g) => n + g.count, 0), fromSeq: Math.min(...gaps.map((g) => g.fromSeq)), toSeq: Math.max(...gaps.map((g) => g.toSeq)) };
}
