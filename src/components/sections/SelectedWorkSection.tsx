import Image from 'next/image';
import Link from 'next/link';
import type { SelectedWorkSectionProps, WorkItem } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';
import { localeHref } from '@/lib/locale-href';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

/**
 * Maps a WORK slug to its real screenshot in /public/work. The data slug for
 * Skills.ws is `skillsws` while the asset is `skills.webp`, so the map is
 * explicit rather than derived. A slug with no entry falls back to a bold
 * typographic card (no broken image).
 */
const SCREENSHOTS: Record<string, string> = {
  vinsfins: '/work/vinsfins.webp',
  lagrocerie: '/work/lagrocerie.webp',
  gategram: '/work/gategram.webp',
  liberclaw: '/work/liberclaw.webp',
  ophis: '/work/ophis.webp',
  skillsws: '/work/skills.webp',
};

export function SelectedWorkSection({
  items,
  viewAllHref,
  locale,
}: SelectedWorkSectionProps & { locale: Locale }) {
  return (
    <section data-section="selectedWork" className="px-6 py-24 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="Our work"
          title="Selected Work"
          accent="Work"
          subhead="Real products we designed, built and shipped, live and in the wild."
          action={
            <Link
              href={localeHref(viewAllHref, locale)}
              className="ol-link inline-flex items-center gap-1 font-mono text-sm uppercase tracking-[0.14em] text-text-dim"
            >
              All work <span aria-hidden>→</span>
            </Link>
          }
        />

        <ScrollReveal
          as="ul"
          role="list"
          selector="[data-work-card]"
          className="mt-14 grid gap-6 md:grid-cols-2"
        >
          {items.map((w, i) => (
            <li
              key={w.slug}
              data-work-card
              // First card spans both columns as the featured, wide hero card.
              className={i === 0 ? 'md:col-span-2' : ''}
            >
              <WorkCard item={w} featured={i === 0} />
            </li>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

const KIND_LABEL: Record<string, string> = {
  'E-commerce': 'E-COMMERCE',
  'Our product': 'OUR PRODUCT',
  'AI assistant': 'AI ASSISTANT',
  'Web3 / DeFi': 'WEB3 · DEFI',
};

function WorkCard({ item, featured }: { item: WorkItem; featured: boolean }) {
  const shot = SCREENSHOTS[item.slug];
  const kind = KIND_LABEL[item.kind] ?? item.kind.toUpperCase();

  return (
    <Link
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      // The whole card is the link. group/hover drives the image zoom + glow.
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface
        transition-[transform,border-color,box-shadow] duration-base ease-out
        hover:-translate-y-1 hover:border-accent hover:shadow-[0_0_50px_-12px_var(--accent-glow)]
        focus-visible:outline-none focus-visible:border-accent focus-visible:shadow-[0_0_50px_-12px_var(--accent-glow)]"
    >
      {/* Screenshot, or a bold typographic fallback if the asset is missing. */}
      <div
        className={`relative w-full overflow-hidden bg-ink2 ${
          featured ? 'aspect-[16/9] md:aspect-[2.2/1]' : 'aspect-[16/10]'
        }`}
      >
        {shot ? (
          <Image
            src={shot}
            alt={`${item.name} screenshot`}
            fill
            sizes={featured ? '(min-width: 768px) 1152px, 100vw' : '(min-width: 768px) 564px, 100vw'}
            className="object-cover object-top transition-transform duration-slow ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-display uppercase leading-none text-surface-2"
            style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }}
          >
            {item.name}
          </span>
        )}
        {/* Mono kind tag, pinned over the image. */}
        <span className="absolute left-4 top-4 rounded-full border border-hairline bg-[rgba(10,10,11,0.72)] px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-text backdrop-blur-sm">
          {kind}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3
          className="font-display uppercase leading-[0.95] tracking-[-0.01em] text-text"
          style={{ fontSize: featured ? 'clamp(2rem, 4vw, 3.25rem)' : 'clamp(1.75rem, 3vw, 2.5rem)' }}
        >
          {item.name}
        </h3>
        <p className="mt-3 max-w-xl text-text-dim">{item.blurb}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-sm uppercase tracking-[0.12em] text-accent transition-transform duration-base ease-out group-hover:translate-x-0.5">
          Visit <span aria-hidden>↗</span>
        </span>
      </div>
    </Link>
  );
}
