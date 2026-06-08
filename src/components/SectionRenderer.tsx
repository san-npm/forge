import { Suspense } from 'react';
import type { Section } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProofStripSection } from '@/components/sections/ProofStripSection';
import { ServicesGridSection } from '@/components/sections/ServicesGridSection';
import { HowWeWorkSection } from '@/components/sections/HowWeWorkSection';
import { SelectedWorkSection } from '@/components/sections/SelectedWorkSection';
import { DeeperProofSection } from '@/components/sections/DeeperProofSection';
import { TrustBlockSection } from '@/components/sections/TrustBlockSection';
import { EnquiryFormSection } from '@/components/sections/EnquiryFormSection';

function assertNever(x: never): never {
  throw new Error(`Unhandled section: ${JSON.stringify(x)}`);
}

function renderSection(section: Section, locale: Locale, key: number) {
  switch (section.type) {
    case 'hero':
      return <HeroSection key={key} {...section} />;
    case 'proofStrip':
      // Wrapped in Suspense: ProofStripSection is async (live fetch + Date.now)
      // and must not block the static shell of the page above it.
      return (
        <Suspense key={key} fallback={null}>
          <ProofStripSection {...section} />
        </Suspense>
      );
    case 'servicesGrid':
      return <ServicesGridSection key={key} {...section} locale={locale} />;
    case 'howWeWork':
      return <HowWeWorkSection key={key} {...section} />;
    case 'selectedWork':
      return <SelectedWorkSection key={key} {...section} locale={locale} />;
    case 'deeperProof':
      return <DeeperProofSection key={key} {...section} />;
    case 'trustBlock':
      return <TrustBlockSection key={key} {...section} />;
    case 'enquiryForm':
      return <EnquiryFormSection key={key} {...section} />;
    default:
      return assertNever(section);
  }
}

export function SectionRenderer({
  sections,
  locale,
}: {
  sections: Section[];
  locale: Locale;
}) {
  return <>{sections.map((section, i) => renderSection(section, locale, i))}</>;
}
