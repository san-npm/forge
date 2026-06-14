import { siteConfig } from '@/lib/site-config';
import type { Locale } from '@/lib/site-config';

export interface LegalSection { title: string; body: string }
export interface LegalDoc { title: string; lastUpdated: string; sections: LegalSection[] }

const { email, privacyEmail, legalEntity } = siteConfig.brand;

const PRIVACY_I18N: Record<Locale, LegalDoc> = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: '2026-06-07',
    sections: [
      {
        title: '1. Who we are',
        body: `Openletz is the studio name of ${legalEntity}. We are the data controller for personal data collected through this website. For any privacy request, contact ${privacyEmail}.`,
      },
      {
        title: '2. Data we collect',
        body:
          'We collect only what you give us: the name, email and message you submit through the enquiry form, and the email address you submit to the newsletter. We do not run trackers beyond privacy-respecting analytics, and we never sell or rent your data.',
      },
      {
        title: '3. How we use it',
        body:
          'Enquiry details are used to reply to your project request. Newsletter emails are used only to send occasional studio updates; you can unsubscribe at any time.',
      },
      {
        title: '4. Where it lives',
        body:
          'Data is processed in the EU. We choose tools with the GDPR in mind and host in Europe wherever possible.',
      },
      {
        title: '5. Your rights',
        body: `Under the GDPR you can access, correct or delete your data, or object to its processing. Email ${privacyEmail} and we will respond within one month.`,
      },
    ],
  },
  fr: {
    title: 'Politique de confidentialité',
    lastUpdated: '2026-06-07',
    sections: [
      {
        title: '1. Qui nous sommes',
        body: `Openletz est le nom de studio de ${legalEntity}. Nous sommes le responsable du traitement des données personnelles collectées via ce site. Pour toute demande relative à la confidentialité, contactez ${privacyEmail}.`,
      },
      {
        title: '2. Les données que nous collectons',
        body:
          'Nous ne collectons que ce que vous nous transmettez : le nom, l’e-mail et le message envoyés via le formulaire de contact, et l’adresse e-mail transmise pour la newsletter. Nous n’utilisons pas de traceurs au-delà d’une mesure d’audience respectueuse de la vie privée, et nous ne vendons ni ne louons jamais vos données.',
      },
      {
        title: '3. Comment nous les utilisons',
        body:
          'Les détails de votre demande servent à répondre à votre projet. Les e-mails de la newsletter servent uniquement à envoyer des nouvelles occasionnelles du studio ; vous pouvez vous désabonner à tout moment.',
      },
      {
        title: '4. Où elles sont traitées',
        body:
          'Les données sont traitées dans l’UE. Nous choisissons nos outils en pensant au RGPD et hébergeons en Europe dans la mesure du possible.',
      },
      {
        title: '5. Vos droits',
        body: `Au titre du RGPD, vous pouvez accéder à vos données, les rectifier ou les supprimer, ou vous opposer à leur traitement. Écrivez à ${privacyEmail} et nous répondrons sous un mois.`,
      },
    ],
  },
  de: {
    title: 'Datenschutzerklärung',
    lastUpdated: '2026-06-07',
    sections: [
      {
        title: '1. Wer wir sind',
        body: `Openletz ist der Studioname von ${legalEntity}. Wir sind der Verantwortliche für die über diese Website erhobenen personenbezogenen Daten. Für Datenschutzanfragen kontaktieren Sie ${privacyEmail}.`,
      },
      {
        title: '2. Welche Daten wir erheben',
        body:
          'Wir erheben nur, was Sie uns geben: Name, E-Mail und Nachricht aus dem Kontaktformular sowie die für den Newsletter übermittelte E-Mail-Adresse. Wir setzen über eine datenschutzfreundliche Reichweitenmessung hinaus keine Tracker ein und verkaufen oder vermieten Ihre Daten niemals.',
      },
      {
        title: '3. Wie wir sie verwenden',
        body:
          'Die Angaben aus Ihrer Anfrage dienen der Beantwortung Ihres Projektwunsches. Newsletter-E-Mails dienen ausschließlich gelegentlichen Studio-Neuigkeiten; Sie können sich jederzeit abmelden.',
      },
      {
        title: '4. Wo sie verarbeitet werden',
        body:
          'Die Daten werden in der EU verarbeitet. Wir wählen unsere Werkzeuge mit Blick auf die DSGVO und hosten nach Möglichkeit in Europa.',
      },
      {
        title: '5. Ihre Rechte',
        body: `Nach der DSGVO können Sie auf Ihre Daten zugreifen, sie berichtigen oder löschen lassen oder der Verarbeitung widersprechen. Schreiben Sie an ${privacyEmail}, und wir antworten innerhalb eines Monats.`,
      },
    ],
  },
};

const TERMS_I18N: Record<Locale, LegalDoc> = {
  en: {
    title: 'Terms of Service',
    lastUpdated: '2026-06-07',
    sections: [
      {
        title: '1. Who we are',
        body: `This website is operated by ${legalEntity}, trading as Openletz. Contact: ${email}.`,
      },
      {
        title: '2. What this site is',
        body:
          'Openletz is the website of a Luxembourg AI agency. It presents our services and work and lets you start a project enquiry. It does not, by itself, create a contract for services.',
      },
      {
        title: '3. Engagements',
        body:
          'Any project we take on is governed by a separate written quote and agreement. Nothing on this site is a binding offer.',
      },
      {
        title: '4. Intellectual property',
        body:
          "The site's content and brand are ours unless stated otherwise. Client work shown here is published with permission.",
      },
      {
        title: '5. Liability & law',
        body: 'The site is provided "as is". These terms are governed by Luxembourg law.',
      },
    ],
  },
  fr: {
    title: 'Conditions générales',
    lastUpdated: '2026-06-07',
    sections: [
      {
        title: '1. Qui nous sommes',
        body: `Ce site est exploité par ${legalEntity}, sous le nom commercial Openletz. Contact : ${email}.`,
      },
      {
        title: '2. Ce qu’est ce site',
        body:
          'Openletz est le site d’une agence IA luxembourgeoise. Il présente nos services et nos réalisations et permet de démarrer une demande de projet. Il ne crée pas, à lui seul, de contrat de prestation.',
      },
      {
        title: '3. Engagements',
        body:
          'Tout projet que nous prenons en charge est régi par un devis et un accord écrits distincts. Rien sur ce site ne constitue une offre contraignante.',
      },
      {
        title: '4. Propriété intellectuelle',
        body:
          'Le contenu et la marque du site nous appartiennent sauf mention contraire. Les travaux clients présentés ici sont publiés avec leur accord.',
      },
      {
        title: '5. Responsabilité & droit applicable',
        body: 'Le site est fourni « en l’état ». Les présentes conditions sont régies par le droit luxembourgeois.',
      },
    ],
  },
  de: {
    title: 'Nutzungsbedingungen',
    lastUpdated: '2026-06-07',
    sections: [
      {
        title: '1. Wer wir sind',
        body: `Diese Website wird von ${legalEntity} betrieben, handelnd unter dem Namen Openletz. Kontakt: ${email}.`,
      },
      {
        title: '2. Was diese Website ist',
        body:
          'Openletz ist die Website einer Luxemburger KI-Agentur. Sie stellt unsere Leistungen und Arbeiten vor und ermöglicht eine Projektanfrage. Sie begründet für sich genommen keinen Dienstleistungsvertrag.',
      },
      {
        title: '3. Aufträge',
        body:
          'Jedes Projekt, das wir übernehmen, unterliegt einem gesonderten schriftlichen Angebot und einer Vereinbarung. Nichts auf dieser Website ist ein verbindliches Angebot.',
      },
      {
        title: '4. Geistiges Eigentum',
        body:
          'Inhalt und Marke der Website gehören uns, sofern nicht anders angegeben. Hier gezeigte Kundenarbeiten werden mit Einwilligung veröffentlicht.',
      },
      {
        title: '5. Haftung & Recht',
        body: 'Die Website wird „wie besehen" bereitgestellt. Diese Bedingungen unterliegen luxemburgischem Recht.',
      },
    ],
  },
};

/** Active-locale privacy policy. */
export function getPrivacy(locale: Locale): LegalDoc {
  return PRIVACY_I18N[locale];
}

/** Active-locale terms of service. */
export function getTerms(locale: Locale): LegalDoc {
  return TERMS_I18N[locale];
}

// EN constants kept for the legal tests.
export const PRIVACY: LegalDoc = PRIVACY_I18N.en;
export const TERMS: LegalDoc = TERMS_I18N.en;
