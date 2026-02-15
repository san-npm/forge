'use client'

import Link from 'next/link'
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
      fr: '1. Description du service',
      en: '1. Service Description',
      lb: '1. Service Description',
      de: '1. Service Description',
      it: '1. Service Description',
      pt: '1. Service Description',
    },
    content: {
      fr: 'Forge est une plateforme en ligne gratuite qui propose :\n\n\u2022 Un simulateur d\u2019\u00e9ligibilit\u00e9 aux subventions : identifiez en 2 minutes les programmes de financement luxembourgeois pour la transformation digitale et l\u2019innovation IA auxquels votre PME pourrait \u00eatre \u00e9ligible.\n\u2022 Un annuaire d\u2019agents IA : d\u00e9couvrez les meilleurs outils d\u2019intelligence artificielle pour votre entreprise, avec des informations sur la conformit\u00e9 RGPD et les tarifs.\n\u2022 Un blog : actualit\u00e9s, guides et conseils sur les aides luxembourgeoises et l\u2019innovation digitale.',
      en: 'Forge is a free online platform that offers:\n\n\u2022 A grant eligibility simulator: identify in 2 minutes which Luxembourg funding programs for digital transformation and AI innovation your SME may be eligible for.\n\u2022 An AI agents directory: discover the best artificial intelligence tools for your business, with information on GDPR compliance and pricing.\n\u2022 A blog: news, guides, and tips about Luxembourg grants and digital innovation.',
      lb: 'Forge is a free online platform that offers:\n\n\u2022 A grant eligibility simulator: identify in 2 minutes which Luxembourg funding programs for digital transformation and AI innovation your SME may be eligible for.\n\u2022 An AI agents directory: discover the best artificial intelligence tools for your business, with information on GDPR compliance and pricing.\n\u2022 A blog: news, guides, and tips about Luxembourg grants and digital innovation.',
      de: 'Forge is a free online platform that offers:\n\n\u2022 A grant eligibility simulator: identify in 2 minutes which Luxembourg funding programs for digital transformation and AI innovation your SME may be eligible for.\n\u2022 An AI agents directory: discover the best artificial intelligence tools for your business, with information on GDPR compliance and pricing.\n\u2022 A blog: news, guides, and tips about Luxembourg grants and digital innovation.',
      it: 'Forge is a free online platform that offers:\n\n\u2022 A grant eligibility simulator: identify in 2 minutes which Luxembourg funding programs for digital transformation and AI innovation your SME may be eligible for.\n\u2022 An AI agents directory: discover the best artificial intelligence tools for your business, with information on GDPR compliance and pricing.\n\u2022 A blog: news, guides, and tips about Luxembourg grants and digital innovation.',
      pt: 'Forge is a free online platform that offers:\n\n\u2022 A grant eligibility simulator: identify in 2 minutes which Luxembourg funding programs for digital transformation and AI innovation your SME may be eligible for.\n\u2022 An AI agents directory: discover the best artificial intelligence tools for your business, with information on GDPR compliance and pricing.\n\u2022 A blog: news, guides, and tips about Luxembourg grants and digital innovation.',
    },
  },
  {
    title: {
      fr: '2. Absence de garantie',
      en: '2. No Guarantee',
      lb: '2. No Guarantee',
      de: '2. No Guarantee',
      it: '2. No Guarantee',
      pt: '2. No Guarantee',
    },
    content: {
      fr: 'Les r\u00e9sultats de la simulation sont fournis \u00e0 titre indicatif uniquement. Ils ne constituent ni un engagement, ni une garantie d\u2019\u00e9ligibilit\u00e9 effective \u00e0 un programme de subvention. L\u2019\u00e9ligibilit\u00e9 r\u00e9elle doit \u00eatre confirm\u00e9e directement aupr\u00e8s de Luxinnovation ou des autorit\u00e9s comp\u00e9tentes. Les montants affich\u00e9s sont des estimations et peuvent varier en fonction de votre situation sp\u00e9cifique.',
      en: 'Simulation results are provided for informational purposes only. They do not constitute a commitment or guarantee of actual eligibility for any grant program. Actual eligibility must be confirmed directly with Luxinnovation or the relevant authorities. The amounts displayed are estimates and may vary depending on your specific situation.',
      lb: 'Simulation results are provided for informational purposes only. They do not constitute a commitment or guarantee of actual eligibility for any grant program. Actual eligibility must be confirmed directly with Luxinnovation or the relevant authorities. The amounts displayed are estimates and may vary depending on your specific situation.',
      de: 'Simulation results are provided for informational purposes only. They do not constitute a commitment or guarantee of actual eligibility for any grant program. Actual eligibility must be confirmed directly with Luxinnovation or the relevant authorities. The amounts displayed are estimates and may vary depending on your specific situation.',
      it: 'Simulation results are provided for informational purposes only. They do not constitute a commitment or guarantee of actual eligibility for any grant program. Actual eligibility must be confirmed directly with Luxinnovation or the relevant authorities. The amounts displayed are estimates and may vary depending on your specific situation.',
      pt: 'Simulation results are provided for informational purposes only. They do not constitute a commitment or guarantee of actual eligibility for any grant program. Actual eligibility must be confirmed directly with Luxinnovation or the relevant authorities. The amounts displayed are estimates and may vary depending on your specific situation.',
    },
  },
  {
    title: {
      fr: '3. Propri\u00e9t\u00e9 intellectuelle',
      en: '3. Intellectual Property',
      lb: '3. Intellectual Property',
      de: '3. Intellectual Property',
      it: '3. Intellectual Property',
      pt: '3. Intellectual Property',
    },
    content: {
      fr: 'L\u2019ensemble du contenu publi\u00e9 sur Forge (textes, graphismes, logos, algorithmes, code source et design) est la propri\u00e9t\u00e9 de Forge et est prot\u00e9g\u00e9 par les lois applicables en mati\u00e8re de propri\u00e9t\u00e9 intellectuelle. Les informations relatives aux agents IA pr\u00e9sent\u00e9es dans l\u2019annuaire sont issues de donn\u00e9es publiques et sont fournies \u00e0 titre informatif.',
      en: 'All content published on Forge (text, graphics, logos, algorithms, source code, and design) is the property of Forge and is protected by applicable intellectual property laws. Information about AI agents presented in the directory is sourced from public data and is provided for informational purposes.',
      lb: 'All content published on Forge (text, graphics, logos, algorithms, source code, and design) is the property of Forge and is protected by applicable intellectual property laws. Information about AI agents presented in the directory is sourced from public data and is provided for informational purposes.',
      de: 'All content published on Forge (text, graphics, logos, algorithms, source code, and design) is the property of Forge and is protected by applicable intellectual property laws. Information about AI agents presented in the directory is sourced from public data and is provided for informational purposes.',
      it: 'All content published on Forge (text, graphics, logos, algorithms, source code, and design) is the property of Forge and is protected by applicable intellectual property laws. Information about AI agents presented in the directory is sourced from public data and is provided for informational purposes.',
      pt: 'All content published on Forge (text, graphics, logos, algorithms, source code, and design) is the property of Forge and is protected by applicable intellectual property laws. Information about AI agents presented in the directory is sourced from public data and is provided for informational purposes.',
    },
  },
  {
    title: {
      fr: '4. Obligations de l\u2019utilisateur',
      en: '4. User Obligations',
      lb: '4. User Obligations',
      de: '4. User Obligations',
      it: '4. User Obligations',
      pt: '4. User Obligations',
    },
    content: {
      fr: 'En utilisant Forge, vous vous engagez \u00e0 :\n\n\u2022 Fournir des informations exactes et v\u00e9ridiques dans le quiz de simulation et les formulaires de contact.\n\u2022 Ne pas utiliser le service \u00e0 des fins frauduleuses, ill\u00e9gales ou contraires aux pr\u00e9sentes conditions.\n\u2022 Ne pas tenter de perturber le fonctionnement du service ou d\u2019acc\u00e9der de mani\u00e8re non autoris\u00e9e \u00e0 nos syst\u00e8mes.',
      en: 'By using Forge, you agree to:\n\n\u2022 Provide accurate and truthful information in the simulation quiz and contact forms.\n\u2022 Not use the service for fraudulent, illegal, or purposes contrary to these terms.\n\u2022 Not attempt to disrupt the operation of the service or gain unauthorized access to our systems.',
      lb: 'By using Forge, you agree to:\n\n\u2022 Provide accurate and truthful information in the simulation quiz and contact forms.\n\u2022 Not use the service for fraudulent, illegal, or purposes contrary to these terms.\n\u2022 Not attempt to disrupt the operation of the service or gain unauthorized access to our systems.',
      de: 'By using Forge, you agree to:\n\n\u2022 Provide accurate and truthful information in the simulation quiz and contact forms.\n\u2022 Not use the service for fraudulent, illegal, or purposes contrary to these terms.\n\u2022 Not attempt to disrupt the operation of the service or gain unauthorized access to our systems.',
      it: 'By using Forge, you agree to:\n\n\u2022 Provide accurate and truthful information in the simulation quiz and contact forms.\n\u2022 Not use the service for fraudulent, illegal, or purposes contrary to these terms.\n\u2022 Not attempt to disrupt the operation of the service or gain unauthorized access to our systems.',
      pt: 'By using Forge, you agree to:\n\n\u2022 Provide accurate and truthful information in the simulation quiz and contact forms.\n\u2022 Not use the service for fraudulent, illegal, or purposes contrary to these terms.\n\u2022 Not attempt to disrupt the operation of the service or gain unauthorized access to our systems.',
    },
  },
  {
    title: {
      fr: '5. Limitation de responsabilit\u00e9',
      en: '5. Limitation of Liability',
      lb: '5. Limitation of Liability',
      de: '5. Limitation of Liability',
      it: '5. Limitation of Liability',
      pt: '5. Limitation of Liability',
    },
    content: {
      fr: 'Forge ne saurait \u00eatre tenu responsable des d\u00e9cisions prises sur la base des r\u00e9sultats de la simulation. Le service est fourni \u00ab tel quel \u00bb, sans garantie d\u2019aucune sorte, expresse ou implicite. Forge d\u00e9cline toute responsabilit\u00e9 en cas de perte financi\u00e8re, de manque \u00e0 gagner ou de tout autre dommage r\u00e9sultant de l\u2019utilisation ou de l\u2019impossibilit\u00e9 d\u2019utiliser le service.',
      en: 'Forge shall not be held liable for any decisions made based on the simulation results. The service is provided "as is", without warranty of any kind, express or implied. Forge disclaims all liability for financial loss, lost profits, or any other damages resulting from the use or inability to use the service.',
      lb: 'Forge shall not be held liable for any decisions made based on the simulation results. The service is provided "as is", without warranty of any kind, express or implied. Forge disclaims all liability for financial loss, lost profits, or any other damages resulting from the use or inability to use the service.',
      de: 'Forge shall not be held liable for any decisions made based on the simulation results. The service is provided "as is", without warranty of any kind, express or implied. Forge disclaims all liability for financial loss, lost profits, or any other damages resulting from the use or inability to use the service.',
      it: 'Forge shall not be held liable for any decisions made based on the simulation results. The service is provided "as is", without warranty of any kind, express or implied. Forge disclaims all liability for financial loss, lost profits, or any other damages resulting from the use or inability to use the service.',
      pt: 'Forge shall not be held liable for any decisions made based on the simulation results. The service is provided "as is", without warranty of any kind, express or implied. Forge disclaims all liability for financial loss, lost profits, or any other damages resulting from the use or inability to use the service.',
    },
  },
  {
    title: {
      fr: '6. Protection des donn\u00e9es',
      en: '6. Data Protection',
      lb: '6. Data Protection',
      de: '6. Data Protection',
      it: '6. Data Protection',
      pt: '6. Data Protection',
    },
    content: {
      fr: 'Pour en savoir plus sur la mani\u00e8re dont nous collectons, utilisons et prot\u00e9geons vos donn\u00e9es personnelles, veuillez consulter notre Politique de confidentialit\u00e9 (/privacy).',
      en: 'To learn more about how we collect, use, and protect your personal data, please see our Privacy Policy (/privacy).',
      lb: 'To learn more about how we collect, use, and protect your personal data, please see our Privacy Policy (/privacy).',
      de: 'To learn more about how we collect, use, and protect your personal data, please see our Privacy Policy (/privacy).',
      it: 'To learn more about how we collect, use, and protect your personal data, please see our Privacy Policy (/privacy).',
      pt: 'To learn more about how we collect, use, and protect your personal data, please see our Privacy Policy (/privacy).',
    },
  },
  {
    title: {
      fr: '7. Droit applicable',
      en: '7. Applicable Law',
      lb: '7. Applicable Law',
      de: '7. Applicable Law',
      it: '7. Applicable Law',
      pt: '7. Applicable Law',
    },
    content: {
      fr: 'Les pr\u00e9sentes conditions d\u2019utilisation sont r\u00e9gies par le droit luxembourgeois. Tout litige relatif \u00e0 l\u2019utilisation du service sera soumis \u00e0 la comp\u00e9tence exclusive des tribunaux du Grand-Duch\u00e9 de Luxembourg.',
      en: 'These terms of service are governed by the laws of Luxembourg. Any dispute relating to the use of the service shall be subject to the exclusive jurisdiction of the courts of the Grand Duchy of Luxembourg.',
      lb: 'These terms of service are governed by the laws of Luxembourg. Any dispute relating to the use of the service shall be subject to the exclusive jurisdiction of the courts of the Grand Duchy of Luxembourg.',
      de: 'These terms of service are governed by the laws of Luxembourg. Any dispute relating to the use of the service shall be subject to the exclusive jurisdiction of the courts of the Grand Duchy of Luxembourg.',
      it: 'These terms of service are governed by the laws of Luxembourg. Any dispute relating to the use of the service shall be subject to the exclusive jurisdiction of the courts of the Grand Duchy of Luxembourg.',
      pt: 'These terms of service are governed by the laws of Luxembourg. Any dispute relating to the use of the service shall be subject to the exclusive jurisdiction of the courts of the Grand Duchy of Luxembourg.',
    },
  },
  {
    title: {
      fr: '8. Contact',
      en: '8. Contact',
      lb: '8. Contact',
      de: '8. Contact',
      it: '8. Contact',
      pt: '8. Contact',
    },
    content: {
      fr: 'Pour toute question relative aux pr\u00e9sentes conditions d\u2019utilisation, vous pouvez nous contacter \u00e0 l\u2019adresse : contact@forge.lu',
      en: 'For any questions regarding these terms of service, you may contact us at: contact@forge.lu',
      lb: 'For any questions regarding these terms of service, you may contact us at: contact@forge.lu',
      de: 'For any questions regarding these terms of service, you may contact us at: contact@forge.lu',
      it: 'For any questions regarding these terms of service, you may contact us at: contact@forge.lu',
      pt: 'For any questions regarding these terms of service, you may contact us at: contact@forge.lu',
    },
  },
]

export default function TermsPage() {
  const { lang, t } = useLanguage()

  const privacyLabel: Record<string, string> = {
    fr: 'Politique de confidentialit\u00e9',
    en: 'Privacy Policy',
    lb: 'Privacy Policy',
    de: 'Privacy Policy',
    it: 'Privacy Policy',
    pt: 'Privacy Policy',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageNavbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 animate-fade-in">
              {t('terms.title')}
            </h1>
            <p className="text-sm text-gray-400">
              {t('terms.lastUpdated')} : {lastUpdatedDate[lang] || lastUpdatedDate.en}
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
                  {section.title.en === '6. Data Protection' ? (
                    <>
                      {(section.content[lang] || section.content.en).split('/privacy').map((part, i, arr) =>
                        i < arr.length - 1 ? (
                          <span key={i}>
                            {part}
                            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">
                              {privacyLabel[lang] || privacyLabel.en}
                            </Link>
                          </span>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </>
                  ) : (
                    section.content[lang] || section.content.en
                  )}
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
