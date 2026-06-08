import { ContactDataSchema, type Contact } from '@/lib/schema';

export type { Contact };

// Ported verbatim from src/components/os/osData.ts (CONTACT).
export const CONTACT: Contact = ContactDataSchema.parse({
  lead: 'Tell us what you want to build. We reply within one business day.',
  types: ['AI automation', 'Web3 / on-chain', 'Website & growth', 'Not sure yet'],
  callLine: 'Prefer to talk? Book a 15-minute intro call.',
});
