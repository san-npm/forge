import type { EnquiryFormSectionProps } from '@/lib/schema';
export function EnquiryFormSection({ id }: EnquiryFormSectionProps) {
  return <section data-section="enquiryForm" id={id} />;
}
