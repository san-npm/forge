import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['fr', 'en', 'de', 'lb', 'it', 'pt', 'es', 'ru', 'ar', 'tr', 'uk'],
  defaultLocale: 'fr',
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
