/**
 * The six steps of one operation, as fractions of the single scroll timeline. Step i lives in [PHASES[i], PHASES[i + 1]].
 * One master timeline drives the whole scene: nothing here is a separate trigger that could compete with another.
 */
export const PHASES = [0, .16, .32, .49, .66, .83, 1] as const;
export const STEPS = 6;

/** Which step a timeline position belongs to. */
export function phaseIndex(progress: number): number {
  for (let i = STEPS - 1; i > 0; i -= 1) if (progress >= PHASES[i] - 0.0001) return i;
  return 0;
}

/** Share of the whole timeline a step takes (used to size the cards on a phone, so text and scene stay in step). */
export const phaseLength = (i: number) => PHASES[i + 1] - PHASES[i];

/** The middle of a step: where the nav marks scroll to. */
export const phaseMiddle = (i: number) => (PHASES[i] + PHASES[i + 1]) / 2;

/** Camera zoom reached in each step (zoom in towards the approval, then back out). */
export const CAMERA = [
  { scale: 1, x: 0, y: 0 },
  { scale: 1.02, x: -8, y: 4 },
  { scale: 1.05, x: -16, y: 8 },
  { scale: 1.1, x: -22, y: 14 },
  { scale: 1.06, x: -12, y: 10 },
  { scale: 1.02, x: 0, y: 2 },
] as const;
