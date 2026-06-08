/**
 * Vitest stub for next/font/google.
 * next/font/google is a Next.js build-time API unavailable in jsdom.
 * Returns deterministic font objects so fonts.ts and its tests work in Vitest.
 * className mirrors variable so fontVariables (built from .variable) satisfies
 * the test assertion: expect(fontVariables).toContain(display.className).
 */
function makeFont(variable: string) {
  return (_opts?: unknown) => ({
    variable,
    className: variable,
    style: { fontFamily: `var(${variable})` },
  });
}

export const Space_Grotesk = makeFont('--font-display');
export const Inter = makeFont('--font-body');
export const JetBrains_Mono = makeFont('--font-mono');
