import { ContactDataSchema, type Contact } from '@/lib/schema';
import type { Locale } from '@/lib/site-config';

export type { Contact };

// `types` are the pillar ENUM VALUES submitted to /api/contact (validated by
// ContactPayloadSchema), so they stay identical across locales. Only `lead` and
// `callLine` are translated; localized pillar DISPLAY labels live in ui.ts.
const CONTACT_TYPES = ['AI automation', 'Web3 / on-chain', 'Website & growth', 'Not sure yet'] as const;

const CONTACT_I18N: Record<Locale, Contact> = {
  en: {
    lead: 'Tell us what you want to build. We reply within one business day.',
    types: [...CONTACT_TYPES],
    callLine: 'Prefer to talk?',
  },
  fr: {
    lead: 'Dites-nous ce que vous voulez construire. Nous répondons sous un jour ouvré.',
    types: [...CONTACT_TYPES],
    callLine: 'Vous préférez en parler ?',
  },
  de: {
    lead: 'Sagen Sie uns, was Sie bauen möchten. Wir antworten innerhalb eines Werktags.',
    types: [...CONTACT_TYPES],
    callLine: 'Lieber sprechen?',
  },
};

const PARSED_CONTACT: Record<Locale, Contact> = {
  en: ContactDataSchema.parse(CONTACT_I18N.en),
  fr: ContactDataSchema.parse(CONTACT_I18N.fr),
  de: ContactDataSchema.parse(CONTACT_I18N.de),
};

/** Active-locale contact content. */
export function getContact(locale: Locale): Contact {
  return PARSED_CONTACT[locale];
}

// EN constant kept for the data tests and the EN homepage spine.
export const CONTACT: Contact = PARSED_CONTACT.en;
