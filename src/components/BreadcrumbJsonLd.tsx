'use client';

import Script from 'next/script';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const pathname = usePathname();
  // Extract locale from pathname
  const locale = pathname.split('/')[1] || 'fr';
  const siteUrl = 'https://www.openletz.com';

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}/${locale}${item.url}`,
    })),
  };

  return (
    <Script
      id="json-ld-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList).replace(/<\/script>/gi, '<\\/script>') }}
    />
  );
}

export function useBreadcrumbs() {
  const t = useTranslations();
  const pathname = usePathname();

  // Extract locale and path
  const parts = pathname.split('/').filter(Boolean);
  const locale = parts[0] || 'fr';
  const path = '/' + parts.slice(1).join('/');

  const pageNames: Record<string, string> = {
    '/': t('nav.simulator') || 'Home',
    '/agents': t('nav.directory') || 'AI Agents',
    '/blog': t('nav.blog') || 'Blog',
    '/about': t('about.title') || 'About',
    '/contact': t('nav.contact') || 'Contact',
    '/pricing': 'Pricing',
  };

  const items = [{ name: t('nav.simulator') || 'Home', url: `/${locale}` }];

  if (path !== `/${locale}` && pageNames[path]) {
    items.push({ name: pageNames[path], url: path });
  }

  return items;
}
