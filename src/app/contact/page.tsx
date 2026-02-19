'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import PageNavbar from '@/components/PageNavbar'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const { t } = useLanguage()

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [rcs, setRcs] = useState('')
  const [role, setRole] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [sector, setSector] = useState('')
  const [subject, setSubject] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [preferredContact, setPreferredContact] = useState('')
  const [formSent, setFormSent] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) return
    setFormError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          company,
          rcs,
          role,
          companySize,
          sector,
          subject,
          email,
          phone,
          message,
          preferredContact,
        }),
      })

      if (res.ok) {
        setFormSent(true)
      } else {
        const data = await res.json()
        setFormError(data.error || 'Error')
      }
    } catch {
      setFormError('Network error')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageNavbar />

      {/* Header */}
      <div className="bg-navy-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in">
          <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t('contactPage.title')}
          </h1>
          <p className="text-lg text-navy-300 max-w-2xl mx-auto">
            {t('contactPage.subtitle')}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-5xl mx-auto px-4 w-full -mt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Info cards */}
          <div className="space-y-5 lg:pt-4">
            {/* Card: Why contact us */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-slide-up">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-navy-900 mb-2">{t('contactPage.info.expert.title')}</h3>
              <p className="text-sm text-navy-500 leading-relaxed">{t('contactPage.info.expert.desc')}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-slide-up" style={{ animationDelay: '0.05s' }}>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-navy-900 mb-2">{t('contactPage.info.response.title')}</h3>
              <p className="text-sm text-navy-500 leading-relaxed">{t('contactPage.info.response.desc')}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-bold text-navy-900 mb-2">{t('contactPage.info.confidential.title')}</h3>
              <p className="text-sm text-navy-500 leading-relaxed">{t('contactPage.info.confidential.desc')}</p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-slide-up">
              {!formSent ? (
                <form onSubmit={handleFormSubmit} className="p-6 sm:p-8 space-y-5">
                  {/* Section: Personal info */}
                  <div>
                    <h2 className="text-sm font-semibold text-navy-900 uppercase tracking-wider mb-4">
                      {t('contactPage.section.personal')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('contact.name')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder={t('contactPage.placeholder.name')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('contact.role')}
                        </label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder={t('contactPage.placeholder.role')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section: Company info */}
                  <div>
                    <h2 className="text-sm font-semibold text-navy-900 uppercase tracking-wider mb-4 pt-2">
                      {t('contactPage.section.company')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('contact.company')}
                        </label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder={t('contactPage.placeholder.company')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('contact.rcs')}
                        </label>
                        <input
                          type="text"
                          value={rcs}
                          onChange={(e) => setRcs(e.target.value)}
                          placeholder={t('contactPage.placeholder.rcs')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('contact.companySize')}
                        </label>
                        <select
                          value={companySize}
                          onChange={(e) => setCompanySize(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                        >
                          <option value="">—</option>
                          <option value="1-10">{t('contact.companySize.o1')}</option>
                          <option value="11-50">{t('contact.companySize.o2')}</option>
                          <option value="51-250">{t('contact.companySize.o3')}</option>
                          <option value="250+">{t('contact.companySize.o4')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('contactPage.sector')}
                        </label>
                        <select
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                        >
                        <option value="">—</option>
                        <option value="horeca">{t('contactPage.sector.horeca')}</option>
                        <option value="retail">{t('contactPage.sector.retail')}</option>
                        <option value="crafts">{t('contactPage.sector.crafts')}</option>
                        <option value="services">{t('contactPage.sector.services')}</option>
                        <option value="manufacturing">{t('contactPage.sector.manufacturing')}</option>
                        <option value="other">{t('contactPage.sector.other')}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section: Your request */}
                  <div>
                    <h2 className="text-sm font-semibold text-navy-900 uppercase tracking-wider mb-4 pt-2">
                      {t('contactPage.section.request')}
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('contact.subject')}
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                      >
                        <option value="">—</option>
                        <option value="eligibility">{t('contactPage.subject.eligibility')}</option>
                        <option value="digital">{t('contact.subject.digital')}</option>
                        <option value="ai">{t('contact.subject.ai')}</option>
                        <option value="innovation">{t('contact.subject.innovation')}</option>
                        <option value="partnership">{t('contactPage.subject.partnership')}</option>
                        <option value="other">{t('contact.subject.other')}</option>
                      </select>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('contact.message')}
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        placeholder={t('contactPage.placeholder.message')}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                      />
                    </div>
                  </div>

                  {/* Section: Contact details */}
                  <div>
                    <h2 className="text-sm font-semibold text-navy-900 uppercase tracking-wider mb-4 pt-2">
                      {t('contactPage.section.contact')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('contact.email')} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder={t('contactPage.placeholder.email')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {t('contact.phone')}
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t('contactPage.placeholder.phone')}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t('contactPage.preferredContact')}
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {['email', 'phone', 'either'].map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="preferredContact"
                              value={opt}
                              checked={preferredContact === opt}
                              onChange={(e) => setPreferredContact(e.target.value)}
                              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                            />
                            <span className="text-sm text-navy-600">{t(`contactPage.preferred.${opt}`)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {formError && (
                    <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{formError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-navy-900 text-white font-semibold rounded-xl shadow-lg shadow-navy-900/20 hover:bg-navy-800 hover:shadow-xl transition-all text-sm"
                  >
                    {t('contact.submit')}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    {t('contactPage.privacy')}
                  </p>
                </form>
              ) : (
                <div className="flex items-center justify-center py-24">
                  <div className="text-center p-6 max-w-md">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-700 mb-2">{t('contact.success')}</h3>
                    <p className="text-gray-500 mb-6">{t('contact.successDesc')}</p>
                    <a
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white font-semibold rounded-xl hover:bg-navy-800 transition-colors text-sm"
                    >
                      {t('contactPage.backToHome')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
