'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-bold text-lg text-gray-900">Forge</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {t('footer.nav')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  {t('footer.simulator')}
                </Link>
              </li>
              <li>
                <Link href="/agents" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  {t('footer.agents')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  {t('footer.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/agents#contact" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gray-200">
          <p className="text-center text-xs text-gray-400">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
