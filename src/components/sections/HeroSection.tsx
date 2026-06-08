import type { HeroSectionProps } from '@/lib/schema';
export function HeroSection({ h1 }: HeroSectionProps) {
  return (
    <section data-section="hero">
      <h1>{h1}</h1>
    </section>
  );
}
