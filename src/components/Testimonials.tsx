import type { Testimonial } from '@/lib/schema';

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="grid gap-6 md:grid-cols-3" data-testid="testimonials">
      {items.map((t, i) => (
        <li key={`${t.name}-${i}`}>
          <figure className="flex h-full flex-col justify-between rounded-lg border border-hairline bg-surface p-6">
            <blockquote className="text-text">
              <p className="text-balance">&ldquo;{t.quote}&rdquo;</p>
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {t.photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={t.photo}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : null}
              <span className="text-sm">
                <span className="block font-medium text-text">{t.name}</span>
                <span className="block text-text-dim">
                  {t.role} · {t.company}
                </span>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
