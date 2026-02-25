'use client'

import { useLanguage } from '@/context/LanguageContext'
import PageNavbar from '@/components/PageNavbar'
import Footer from '@/components/Footer'

const lastUpdatedDate: Record<string, string> = {
  fr: '15 f\u00e9vrier 2025',
  en: 'February 15, 2025',
  lb: '15. Februar 2025',
  de: '15. Februar 2025',
  it: '15 febbraio 2025',
  pt: '15 de fevereiro de 2025',
}

const sections: { title: Record<string, string>; content: Record<string, string> }[] = [
  {
    title: {
      fr: '1. Collecte des donn\u00e9es',
      en: '1. Data Collection',
      lb: '1. Data Collection',
      de: '1. Data Collection',
      it: '1. Data Collection',
      pt: '1. Data Collection',
    },
    content: {
      fr: 'OpenLetz collecte les donn\u00e9es suivantes lorsque vous utilisez notre service :\n\n\u2022 R\u00e9ponses au quiz : taille de l\u2019entreprise, secteur d\u2019activit\u00e9, statut au Luxembourg, maturit\u00e9 digitale, principaux d\u00e9fis et utilisation de l\u2019IA. Ces donn\u00e9es sont utilis\u00e9es uniquement pour calculer votre \u00e9ligibilit\u00e9 aux programmes de subventions et ne sont pas stock\u00e9es sur nos serveurs.\n\u2022 Newsletter : adresse email, utilis\u00e9e uniquement pour l\u2019envoi de nos actualit\u00e9s.\n\u2022 Formulaire de contact : nom, entreprise, email, t\u00e9l\u00e9phone et message, utilis\u00e9s pour traiter votre demande de rappel par un expert.',
      en: 'OpenLetz collects the following data when you use our service:\n\n\u2022 Quiz answers: company size, industry sector, Luxembourg establishment status, digital maturity, main challenges, and AI usage. This data is used solely to calculate your eligibility for grant programs and is not stored on our servers.\n\u2022 Newsletter: email address, used only to send you our updates.\n\u2022 Contact form: name, company, email, phone, and message, used to process your expert callback request.',
      lb: 'OpenLetz collects the following data when you use our service:\n\n\u2022 Quiz answers: company size, industry sector, Luxembourg establishment status, digital maturity, main challenges, and AI usage. This data is used solely to calculate your eligibility for grant programs and is not stored on our servers.\n\u2022 Newsletter: email address, used only to send you our updates.\n\u2022 Contact form: name, company, email, phone, and message, used to process your expert callback request.',
      de: 'OpenLetz collects the following data when you use our service:\n\n\u2022 Quiz answers: company size, industry sector, Luxembourg establishment status, digital maturity, main challenges, and AI usage. This data is used solely to calculate your eligibility for grant programs and is not stored on our servers.\n\u2022 Newsletter: email address, used only to send you our updates.\n\u2022 Contact form: name, company, email, phone, and message, used to process your expert callback request.',
      it: 'OpenLetz collects the following data when you use our service:\n\n\u2022 Quiz answers: company size, industry sector, Luxembourg establishment status, digital maturity, main challenges, and AI usage. This data is used solely to calculate your eligibility for grant programs and is not stored on our servers.\n\u2022 Newsletter: email address, used only to send you our updates.\n\u2022 Contact form: name, company, email, phone, and message, used to process your expert callback request.',
      pt: 'OpenLetz collects the following data when you use our service:\n\n\u2022 Quiz answers: company size, industry sector, Luxembourg establishment status, digital maturity, main challenges, and AI usage. This data is used solely to calculate your eligibility for grant programs and is not stored on our servers.\n\u2022 Newsletter: email address, used only to send you our updates.\n\u2022 Contact form: name, company, email, phone, and message, used to process your expert callback request.',
    },
  },
  {
    title: {
      fr: '2. Utilisation des donn\u00e9es',
      en: '2. Data Usage',
      lb: '2. Data Usage',
      de: '2. Data Usage',
      it: '2. Data Usage',
      pt: '2. Data Usage',
    },
    content: {
      fr: 'Vos donn\u00e9es sont utilis\u00e9es exclusivement pour :\n\n\u2022 La simulation d\u2019\u00e9ligibilit\u00e9 : vos r\u00e9ponses au quiz sont trait\u00e9es c\u00f4t\u00e9 client pour d\u00e9terminer les programmes de subventions auxquels vous pourriez \u00eatre \u00e9ligible.\n\u2022 La newsletter : votre adresse email est utilis\u00e9e pour vous envoyer des informations sur les aides luxembourgeoises et l\u2019innovation digitale.\n\u2022 Les demandes de contact : vos coordonn\u00e9es sont utilis\u00e9es pour qu\u2019un expert puisse vous recontacter.\n\nNous ne vendons, ne louons et ne partageons jamais vos donn\u00e9es personnelles avec des tiers.',
      en: 'Your data is used exclusively for:\n\n\u2022 Eligibility simulation: your quiz answers are processed client-side to determine which grant programs you may be eligible for.\n\u2022 Newsletter: your email address is used to send you information about Luxembourg grants and digital innovation.\n\u2022 Contact requests: your contact details are used so an expert can get back to you.\n\nWe never sell, rent, or share your personal data with third parties.',
      lb: 'Your data is used exclusively for:\n\n\u2022 Eligibility simulation: your quiz answers are processed client-side to determine which grant programs you may be eligible for.\n\u2022 Newsletter: your email address is used to send you information about Luxembourg grants and digital innovation.\n\u2022 Contact requests: your contact details are used so an expert can get back to you.\n\nWe never sell, rent, or share your personal data with third parties.',
      de: 'Your data is used exclusively for:\n\n\u2022 Eligibility simulation: your quiz answers are processed client-side to determine which grant programs you may be eligible for.\n\u2022 Newsletter: your email address is used to send you information about Luxembourg grants and digital innovation.\n\u2022 Contact requests: your contact details are used so an expert can get back to you.\n\nWe never sell, rent, or share your personal data with third parties.',
      it: 'Your data is used exclusively for:\n\n\u2022 Eligibility simulation: your quiz answers are processed client-side to determine which grant programs you may be eligible for.\n\u2022 Newsletter: your email address is used to send you information about Luxembourg grants and digital innovation.\n\u2022 Contact requests: your contact details are used so an expert can get back to you.\n\nWe never sell, rent, or share your personal data with third parties.',
      pt: 'Your data is used exclusively for:\n\n\u2022 Eligibility simulation: your quiz answers are processed client-side to determine which grant programs you may be eligible for.\n\u2022 Newsletter: your email address is used to send you information about Luxembourg grants and digital innovation.\n\u2022 Contact requests: your contact details are used so an expert can get back to you.\n\nWe never sell, rent, or share your personal data with third parties.',
    },
  },
  {
    title: {
      fr: '3. Stockage des donn\u00e9es',
      en: '3. Data Storage',
      lb: '3. Data Storage',
      de: '3. Data Storage',
      it: '3. Data Storage',
      pt: '3. Data Storage',
    },
    content: {
      fr: 'Les donn\u00e9es collect\u00e9es via le formulaire de contact sont stock\u00e9es dans un fichier JSON sur nos serveurs (data/contacts.json). Les adresses email de la newsletter sont stock\u00e9es dans un fichier s\u00e9par\u00e9 (data/newsletter.json) avec d\u00e9doublonnage automatique.\n\nNous n\u2019utilisons aucun service d\u2019analyse tiers (pas de Google Analytics, pas de pixels de suivi). Aucune donn\u00e9e n\u2019est transmise \u00e0 des plateformes tierces.',
      en: 'Data collected through the contact form is stored in a JSON file on our servers (data/contacts.json). Newsletter email addresses are stored in a separate file (data/newsletter.json) with automatic deduplication.\n\nWe do not use any third-party analytics services (no Google Analytics, no tracking pixels). No data is transmitted to third-party platforms.',
      lb: 'Data collected through the contact form is stored in a JSON file on our servers (data/contacts.json). Newsletter email addresses are stored in a separate file (data/newsletter.json) with automatic deduplication.\n\nWe do not use any third-party analytics services (no Google Analytics, no tracking pixels). No data is transmitted to third-party platforms.',
      de: 'Data collected through the contact form is stored in a JSON file on our servers (data/contacts.json). Newsletter email addresses are stored in a separate file (data/newsletter.json) with automatic deduplication.\n\nWe do not use any third-party analytics services (no Google Analytics, no tracking pixels). No data is transmitted to third-party platforms.',
      it: 'Data collected through the contact form is stored in a JSON file on our servers (data/contacts.json). Newsletter email addresses are stored in a separate file (data/newsletter.json) with automatic deduplication.\n\nWe do not use any third-party analytics services (no Google Analytics, no tracking pixels). No data is transmitted to third-party platforms.',
      pt: 'Data collected through the contact form is stored in a JSON file on our servers (data/contacts.json). Newsletter email addresses are stored in a separate file (data/newsletter.json) with automatic deduplication.\n\nWe do not use any third-party analytics services (no Google Analytics, no tracking pixels). No data is transmitted to third-party platforms.',
    },
  },
  {
    title: {
      fr: '4. Cookies',
      en: '4. Cookies',
      lb: '4. Cookies',
      de: '4. Cookies',
      it: '4. Cookies',
      pt: '4. Cookies',
    },
    content: {
      fr: 'OpenLetz n\u2019utilise aucun cookie, aucun traceur et aucune technologie de suivi. Votre choix de langue est conserv\u00e9 uniquement dans l\u2019\u00e9tat de l\u2019application (m\u00e9moire du navigateur) et n\u2019est pas persist\u00e9 entre les sessions.',
      en: 'OpenLetz does not use any cookies, trackers, or tracking technologies. Your language preference is kept only in the application state (browser memory) and is not persisted between sessions.',
      lb: 'OpenLetz does not use any cookies, trackers, or tracking technologies. Your language preference is kept only in the application state (browser memory) and is not persisted between sessions.',
      de: 'OpenLetz does not use any cookies, trackers, or tracking technologies. Your language preference is kept only in the application state (browser memory) and is not persisted between sessions.',
      it: 'OpenLetz does not use any cookies, trackers, or tracking technologies. Your language preference is kept only in the application state (browser memory) and is not persisted between sessions.',
      pt: 'OpenLetz does not use any cookies, trackers, or tracking technologies. Your language preference is kept only in the application state (browser memory) and is not persisted between sessions.',
    },
  },
  {
    title: {
      fr: '5. Vos droits (RGPD Art. 13-22)',
      en: '5. Your Rights (GDPR Art. 13-22)',
      lb: '5. Your Rights (GDPR Art. 13-22)',
      de: '5. Your Rights (GDPR Art. 13-22)',
      it: '5. Your Rights (GDPR Art. 13-22)',
      pt: '5. Your Rights (GDPR Art. 13-22)',
    },
    content: {
      fr: 'Conform\u00e9ment au R\u00e8glement G\u00e9n\u00e9ral sur la Protection des Donn\u00e9es (RGPD), vous disposez des droits suivants :\n\n\u2022 Droit d\u2019acc\u00e8s : vous pouvez demander une copie de vos donn\u00e9es personnelles d\u00e9tenues par OpenLetz.\n\u2022 Droit de rectification : vous pouvez demander la correction de donn\u00e9es inexactes ou incompl\u00e8tes.\n\u2022 Droit \u00e0 l\u2019effacement : vous pouvez demander la suppression de vos donn\u00e9es personnelles.\n\u2022 Droit \u00e0 la portabilit\u00e9 : vous pouvez demander \u00e0 recevoir vos donn\u00e9es dans un format structur\u00e9 et lisible par machine.\n\nPour exercer ces droits, contactez-nous \u00e0 : privacy@openletz.com',
      en: 'In accordance with the General Data Protection Regulation (GDPR), you have the following rights:\n\n\u2022 Right of access: you may request a copy of the personal data OpenLetz holds about you.\n\u2022 Right to rectification: you may request the correction of inaccurate or incomplete data.\n\u2022 Right to erasure: you may request the deletion of your personal data.\n\u2022 Right to data portability: you may request to receive your data in a structured, machine-readable format.\n\nTo exercise these rights, contact us at: privacy@openletz.com',
      lb: 'In accordance with the General Data Protection Regulation (GDPR), you have the following rights:\n\n\u2022 Right of access: you may request a copy of the personal data OpenLetz holds about you.\n\u2022 Right to rectification: you may request the correction of inaccurate or incomplete data.\n\u2022 Right to erasure: you may request the deletion of your personal data.\n\u2022 Right to data portability: you may request to receive your data in a structured, machine-readable format.\n\nTo exercise these rights, contact us at: privacy@openletz.com',
      de: 'In accordance with the General Data Protection Regulation (GDPR), you have the following rights:\n\n\u2022 Right of access: you may request a copy of the personal data OpenLetz holds about you.\n\u2022 Right to rectification: you may request the correction of inaccurate or incomplete data.\n\u2022 Right to erasure: you may request the deletion of your personal data.\n\u2022 Right to data portability: you may request to receive your data in a structured, machine-readable format.\n\nTo exercise these rights, contact us at: privacy@openletz.com',
      it: 'In accordance with the General Data Protection Regulation (GDPR), you have the following rights:\n\n\u2022 Right of access: you may request a copy of the personal data OpenLetz holds about you.\n\u2022 Right to rectification: you may request the correction of inaccurate or incomplete data.\n\u2022 Right to erasure: you may request the deletion of your personal data.\n\u2022 Right to data portability: you may request to receive your data in a structured, machine-readable format.\n\nTo exercise these rights, contact us at: privacy@openletz.com',
      pt: 'In accordance with the General Data Protection Regulation (GDPR), you have the following rights:\n\n\u2022 Right of access: you may request a copy of the personal data OpenLetz holds about you.\n\u2022 Right to rectification: you may request the correction of inaccurate or incomplete data.\n\u2022 Right to erasure: you may request the deletion of your personal data.\n\u2022 Right to data portability: you may request to receive your data in a structured, machine-readable format.\n\nTo exercise these rights, contact us at: privacy@openletz.com',
    },
  },
  {
    title: {
      fr: '6. Responsable du traitement',
      en: '6. Data Controller',
      lb: '6. Data Controller',
      de: '6. Data Controller',
      it: '6. Data Controller',
      pt: '6. Data Controller',
    },
    content: {
      fr: 'Le responsable du traitement des donn\u00e9es est OpenLetz, bas\u00e9 au Luxembourg. Pour toute question relative \u00e0 la protection de vos donn\u00e9es personnelles, vous pouvez nous contacter \u00e0 l\u2019adresse : privacy@openletz.com',
      en: 'The data controller is OpenLetz, based in Luxembourg. For any questions regarding the protection of your personal data, you may contact us at: privacy@openletz.com',
      lb: 'The data controller is OpenLetz, based in Luxembourg. For any questions regarding the protection of your personal data, you may contact us at: privacy@openletz.com',
      de: 'The data controller is OpenLetz, based in Luxembourg. For any questions regarding the protection of your personal data, you may contact us at: privacy@openletz.com',
      it: 'The data controller is OpenLetz, based in Luxembourg. For any questions regarding the protection of your personal data, you may contact us at: privacy@openletz.com',
      pt: 'The data controller is OpenLetz, based in Luxembourg. For any questions regarding the protection of your personal data, you may contact us at: privacy@openletz.com',
    },
  },
  {
    title: {
      fr: '7. Modifications',
      en: '7. Changes',
      lb: '7. Changes',
      de: '7. Changes',
      it: '7. Changes',
      pt: '7. Changes',
    },
    content: {
      fr: 'Nous nous r\u00e9servons le droit de modifier cette politique de confidentialit\u00e9 \u00e0 tout moment. Toute modification sera publi\u00e9e sur cette page avec une date de mise \u00e0 jour r\u00e9vis\u00e9e. Nous vous encourageons \u00e0 consulter r\u00e9guli\u00e8rement cette page pour rester inform\u00e9 de nos pratiques en mati\u00e8re de protection des donn\u00e9es.',
      en: 'We reserve the right to update this privacy policy at any time. Any changes will be posted on this page with a revised update date. We encourage you to review this page regularly to stay informed about our data protection practices.',
      lb: 'We reserve the right to update this privacy policy at any time. Any changes will be posted on this page with a revised update date. We encourage you to review this page regularly to stay informed about our data protection practices.',
      de: 'We reserve the right to update this privacy policy at any time. Any changes will be posted on this page with a revised update date. We encourage you to review this page regularly to stay informed about our data protection practices.',
      it: 'We reserve the right to update this privacy policy at any time. Any changes will be posted on this page with a revised update date. We encourage you to review this page regularly to stay informed about our data protection practices.',
      pt: 'We reserve the right to update this privacy policy at any time. Any changes will be posted on this page with a revised update date. We encourage you to review this page regularly to stay informed about our data protection practices.',
    },
  },
]

export default function PrivacyPage() {
  const { lang, t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PageNavbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 animate-fade-in">
              {t('privacy.title')}
            </h1>
            <p className="text-sm text-gray-400">
              {t('privacy.lastUpdated')} : {lastUpdatedDate[lang] || lastUpdatedDate.en}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, index) => (
              <section key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {section.title[lang] || section.title.en}
                </h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                  {section.content[lang] || section.content.en}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
