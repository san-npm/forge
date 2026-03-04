'use client'

import { useEffect } from 'react'
import { LanguageProvider, useLanguage } from '@/context/LanguageContext'

function LangSync({ children }: { children: React.ReactNode }) {
  const { lang } = useLanguage()

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LangSync>{children}</LangSync>
    </LanguageProvider>
  )
}
