import Link from 'next/link';
import type { Locale } from '@/lib/site-config';
import { siteConfig } from '@/lib/site-config';
import { FOOTER } from '@/data/nav';
import { NewsletterForm } from '@/components/NewsletterForm';

export function Footer({ locale }: { locale: Locale }) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  // External links (mailto:, https://) keep their absolute href; internal
  // page links get the locale prefix.
  const resolve = (href: string) =>
    /^(https?:|mailto:|#)/.test(href) ? href : `${prefix}${href}`;

  return (
    <footer data-footer className="border-t border-hairline px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 md:grid-cols-4">
          {FOOTER.map((col) => (
            <div key={col.heading} data-footer-col>
              <h3 className="font-mono text-xs uppercase tracking-widest text-text-dim">
                {col.heading}
              </h3>
              <ul role="list" className="mt-4 grid gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={resolve(l.href)} className="text-text-dim hover:text-hot">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 max-w-md">
          <NewsletterForm />
        </div>
        <p className="mt-12 text-sm text-text-dim">{siteConfig.brand.legalEntity}</p>
      </div>
    </footer>
  );
}
