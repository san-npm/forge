export interface HairlineProps {
  /** Render the centered signal-glyph divider instead of a plain rule. */
  glyph?: boolean;
  className?: string;
}

/**
 * Hairline rule / signal-glyph divider. Pure Server component — no motion,
 * no client JS. Uses the --hairline token via Tailwind's hairline color.
 */
export function Hairline({ glyph = false, className }: HairlineProps) {
  if (!glyph) {
    return <hr className={`border-0 border-t border-hairline ${className ?? ''}`} />;
  }
  return (
    <div className={`flex items-center gap-4 ${className ?? ''}`} role="separator">
      <span className="h-px flex-1 bg-hairline" />
      <span aria-hidden="true" className="font-mono text-xs text-text-dim">
        ✳
      </span>
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}
