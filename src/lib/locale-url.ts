// Back-compat shim: the canonical builder now lives in site-config.ts.
// Existing imports of `localeUrl` from '@/lib/locale-url' keep working.
export { localeUrl, SITE_URL } from '@/lib/site-config';
