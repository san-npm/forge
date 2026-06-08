import type { ServicesGridSectionProps } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
export function ServicesGridSection(_: ServicesGridSectionProps & { locale: Locale }) {
  return <section data-section="servicesGrid" />;
}
