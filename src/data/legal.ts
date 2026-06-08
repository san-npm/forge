import { siteConfig } from '@/lib/site-config';

export interface LegalSection { title: string; body: string }
export interface LegalDoc { title: string; lastUpdated: string; sections: LegalSection[] }

const { email, privacyEmail, legalEntity } = siteConfig.brand;

export const PRIVACY: LegalDoc = {
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
};

export const TERMS: LegalDoc = {
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
};
