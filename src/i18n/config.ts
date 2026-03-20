export const locales = ['fr', 'en', 'de', 'lb', 'it', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';
