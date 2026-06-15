import type { Section } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
import { getUiStrings, type UiStrings } from '@/data/ui';
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

function renderSection(section: Section, locale: Locale, ui: UiStrings, key: number) {
  switch (section.type) {
    case 'hero':
      return <HeroSection key={key} {...section} locale={locale} ui={ui} />;
    case 'proofStrip':
      // Static now (no live fetch): render directly, no Suspense boundary.
      return <ProofStripSection key={key} {...section} />;
    case 'servicesGrid':
      return <ServicesGridSection key={key} {...section} locale={locale} ui={ui} />;
    case 'howWeWork':
      return <HowWeWorkSection key={key} {...section} ui={ui} />;
    case 'selectedWork':
      return <SelectedWorkSection key={key} {...section} locale={locale} ui={ui} />;
    case 'deeperProof':
      return <DeeperProofSection key={key} {...section} />;
    case 'trustBlock':
      return <TrustBlockSection key={key} {...section} ui={ui} />;
    case 'enquiryForm':
      return <EnquiryFormSection key={key} {...section} locale={locale} ui={ui} />;
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
  const ui = getUiStrings(locale);
  return <>{sections.map((section, i) => renderSection(section, locale, ui, i))}</>;
}
