'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export type Language = 'fr' | 'en' | 'lb' | 'de' | 'it' | 'pt' | 'es' | 'ru' | 'ar' | 'tr' | 'uk';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const tIntl = useTranslations();
  const locale = useLocale() as Language;
  const router = useRouter();
  const pathname = usePathname();

  const setLang = useCallback(
    (newLang: Language) => {
      router.replace(pathname, { locale: newLang });
    },
    [router, pathname]
  );

  const t = useCallback(
    (key: string): string => {
      try {
        return tIntl(key as never);
      } catch {
        return key;
      }
    },
    [tIntl]
  );

  return (
    <LanguageContext.Provider value={{ lang: locale, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
