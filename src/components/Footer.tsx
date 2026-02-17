'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/openletz.svg" alt="OpenLetz" className="w-8 h-8 invert" />
              <span className="font-bold text-lg">OpenLetz</span>
            </div>
            <p className="text-sm text-navy-400 leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t('footer.nav')}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="/" className="text-sm text-navy-400 hover:text-primary-400 transition-colors">
                  {t('footer.simulator')}
                </a>
              </li>
              <li>
                <Link href="/agents" className="text-sm text-navy-400 hover:text-primary-400 transition-colors">
                  {t('footer.agents')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-navy-400 hover:text-primary-400 transition-colors">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-navy-400 hover:text-primary-400 transition-colors">
                  {t('footer.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy" className="text-sm text-navy-400 hover:text-primary-400 transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-navy-400 hover:text-primary-400 transition-colors">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-navy-400 hover:text-primary-400 transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-navy-800">
          <p className="text-center text-xs text-navy-500">
            {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
