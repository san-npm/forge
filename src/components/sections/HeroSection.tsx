import Link from 'next/link';
import type { HeroSectionProps } from '@/lib/schema';
import { Reveal } from '@/components/ui/Reveal';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function HeroSection({ h1, sub, lead, primaryCta, secondaryCta }: HeroSectionProps) {
  return (
    <section data-section="hero" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* LCP node: full opacity on first paint, NOT wrapped in Reveal */}
        <h1 className="text-balance text-5xl font-semibold tracking-tight text-text md:text-7xl">
          {h1}
        </h1>
        {/* Below-LCP copy may animate in */}
        <Reveal as="p" className="mt-4 text-2xl text-text-dim">
          {sub}
        </Reveal>
        <Reveal as="p" className="mt-6 max-w-2xl text-lg text-text-dim">
          {lead}
        </Reveal>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <MagneticButton asChild>
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </MagneticButton>
          <Link href={secondaryCta.href} className="ol-link text-text-dim hover:text-hot">
            {secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
