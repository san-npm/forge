import type { SelectedWorkSectionProps } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
export function SelectedWorkSection(_: SelectedWorkSectionProps & { locale: Locale }) {
  return <section data-section="selectedWork" />;
}
