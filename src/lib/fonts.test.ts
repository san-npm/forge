import { describe, it, expect } from 'vitest';
import { fontVariables, display, body, mono } from '@/lib/fonts';

describe('fonts', () => {
  it('exposes the three CSS-var class names', () => {
    expect(display.variable).toBe('--font-display');
    expect(body.variable).toBe('--font-body');
    expect(mono.variable).toBe('--font-mono');
  });
  it('fontVariables joins all three class names', () => {
    expect(fontVariables).toContain(display.className);
    expect(fontVariables).toContain(body.className);
    expect(fontVariables).toContain(mono.className);
  });
});
