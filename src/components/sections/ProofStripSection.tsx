import type { ProofStripSectionProps } from '@/lib/schema';
export function ProofStripSection({ label }: ProofStripSectionProps) {
  return <section data-section="proofStrip" aria-label={label} />;
}
