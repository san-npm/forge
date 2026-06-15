import Link from 'next/link';
import type { EnquiryFormSectionProps } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
import { getUiStrings, type UiStrings } from '@/data/ui';
import { localeHref } from '@/lib/locale-href';
import { EnquiryForm } from '@/components/EnquiryForm';
import { SectionHeading } from '@/components/sections/SectionHeading';

export function EnquiryFormSection({
  id,
  headline,
  pillars,
  callLine,
  bookCallHref,
  locale,
  ui,
}: EnquiryFormSectionProps & { locale: Locale; ui?: UiStrings }) {
  const t = ui ?? getUiStrings(locale);
  return (
    <section data-section="enquiryForm" id={id} className="px-6 py-28 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:items-start">
        {/* Left: the poster pitch. */}
        <div className="md:sticky md:top-28">
          <SectionHeading
            kicker={t.sections.enquiryKicker}
            title={t.sections.enquiryTitle}
            accent={t.sections.enquiryAccent}
            subhead={headline}
          />
          <p className="mt-8 text-sm text-text-dim">
            {callLine}{' '}
            <Link href={localeHref(bookCallHref, locale)} className="ol-link text-accent">
              {t.sections.bookCall}
            </Link>
          </p>
        </div>

        {/* Right: the enquiry form island (ol- field + button styling). */}
        <div className="rounded-2xl border border-hairline bg-surface p-7 md:p-8">
          <EnquiryForm pillars={pillars} ui={t} />
        </div>
      </div>
    </section>
  );
}
