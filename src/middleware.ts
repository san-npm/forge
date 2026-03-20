import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - /api, /admin, /_next, /_vercel, /favicon.ico, static assets
  matcher: [
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
};
