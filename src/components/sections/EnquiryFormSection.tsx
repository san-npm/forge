import Link from 'next/link';
import type { EnquiryFormSectionProps } from '@/lib/schema';
import { EnquiryForm } from '@/components/EnquiryForm';

export function EnquiryFormSection({
  id,
  headline,
  pillars,
  callLine,
  bookCallHref,
}: EnquiryFormSectionProps) {
  return (
    <section data-section="enquiryForm" id={id} className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-semibold text-text">{headline}</h2>
        <div className="mt-8">
          <EnquiryForm pillars={pillars} />
        </div>
        <p className="mt-6 text-sm text-text-dim">
          {callLine}{' '}
          <Link href={bookCallHref} className="ol-link text-hot">
            Book a 15-minute intro call
          </Link>
        </p>
      </div>
    </section>
  );
}
