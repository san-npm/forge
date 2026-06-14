import { z } from 'zod';

/**
 * Content for the SME Package page (English; FR/DE is a later task).
 *
 * Single source of truth, validated at module load so malformed copy fails the
 * build. Facts mirror the official programme (Ministry of the Economy +
 * Luxinnovation): 70% of eligible costs, EUR 3,000 to EUR 25,000 excl. VAT,
 * reimbursed AFTER delivery, subject to eligibility and Ministry approval.
 *
 * Copy rule: no em-dashes anywhere. Use commas, periods, colons.
 */

const CategorySchema = z.object({
  title: z.string().min(1),
  desc: z.string().min(1),
});

const StepSchema = z.object({
  n: z.string().regex(/^\d{2}$/),
  title: z.string().min(1),
  desc: z.string().min(1),
});

const BonusSchema = z.object({
  title: z.string().min(1),
  desc: z.string().min(1),
});

const FaqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

const SmePackageContentSchema = z.object({
  /** Official guichet.lu programme page (linked, opens in a new tab). */
  officialUrl: z.string().url(),
  hero: z.object({
    kicker: z.string().min(1),
    lead: z.string().min(1),
  }),
  what: z.object({
    kicker: z.string().min(1),
    title: z.string().min(1),
    accent: z.string().min(1),
    body: z.array(z.string().min(1)).min(1),
  }),
  categories: z.array(CategorySchema).min(3),
  steps: z.array(StepSchema).length(5),
  bonus: z.array(BonusSchema).length(3),
  eligibility: z.object({
    points: z.array(z.string().min(1)).min(1),
    caveat: z.string().min(1),
  }),
  faqs: z.array(FaqSchema).min(4),
});

export type SmePackageContent = z.infer<typeof SmePackageContentSchema>;

export const SME_PACKAGE: SmePackageContent = SmePackageContentSchema.parse({
  officialUrl:
    'https://guichet.public.lu/en/entreprises/financement-aides/regime-sme-packages/soutien-pme/sme-packages-digital.html',

  hero: {
    kicker: 'SME Package · Luxembourg',
    lead: 'A Luxembourg state grant covers 70% of your digital or AI project, from EUR 3,000 to EUR 25,000. We scope it, build it, and help you claim it.',
  },

  what: {
    kicker: 'What it is',
    title: 'State aid for Luxembourg SMEs',
    accent: 'aid',
    body: [
      'The SME Package is a Luxembourg state aid scheme run by the Ministry of the Economy with Luxinnovation, in place since 2019. It reimburses 70% of the eligible cost of a qualifying project.',
      'Eligible projects run from EUR 3,000 to EUR 25,000 excluding VAT. They are open to SMEs with a Luxembourg business permit and a registered office in Luxembourg that meet the SME criteria. Openletz is the eligible service provider: you receive the grant, not us.',
    ],
  },

  categories: [
    {
      title: 'Website & e-commerce',
      desc: 'Creation of a website or online shop, built to convert and to last.',
    },
    {
      title: 'Digital & social marketing',
      desc: 'Digital marketing and social presence that get your work seen.',
    },
    {
      title: 'AI initiatives',
      desc: 'AI agents, chatbots and automations applied to your real operations.',
    },
    {
      title: 'Management systems / ERP',
      desc: 'ERP, business software and cash-register systems that fit how you work.',
    },
    {
      title: 'E-invoicing',
      desc: 'Electronic invoicing set up cleanly and ready for what is required.',
    },
  ],

  steps: [
    {
      n: '01',
      title: 'Pre-analysis',
      desc: 'A first analysis with the House of Entrepreneurship or the Chamber of Skilled Trades to confirm the fit.',
    },
    {
      n: '02',
      title: 'Define & quote',
      desc: 'We define the package together and prepare a quote between EUR 3,000 and EUR 25,000.',
    },
    {
      n: '03',
      title: 'Application',
      desc: 'The application is submitted, and the Ministry of the Economy decides on the aid.',
    },
    {
      n: '04',
      title: 'We build it',
      desc: 'Once approved, Openletz implements the project as scoped.',
    },
    {
      n: '05',
      title: 'You claim 70% back',
      desc: 'After completion you pay the provider, then the Ministry reimburses 70% to your company.',
    },
  ],

  bonus: [
    {
      title: 'Paperwork, handled with you',
      desc: 'We help prepare the application and the supporting documents so the process is not on your plate alone.',
    },
    {
      title: 'We scope what qualifies',
      desc: 'We only take on projects we believe fit the programme, so your application stands on solid ground. We never promise approval.',
    },
    {
      title: 'You own everything',
      desc: 'The website, the code, the automations, the accounts: everything we build is yours to keep.',
    },
  ],

  eligibility: {
    points: [
      'An SME with a Luxembourg business permit.',
      'A registered office in Luxembourg.',
      'Meeting the SME criteria (staff and financial thresholds).',
      'A defined project in an eligible area, scoped between EUR 3,000 and EUR 25,000 excl. VAT.',
    ],
    caveat:
      'These figures are indicative. Actual aid depends on your eligibility and on approval by the Ministry of the Economy. The SME Package reimburses 70% after the project is delivered: you pay the provider first, then your company is reimbursed.',
  },

  faqs: [
    {
      q: 'Who is eligible?',
      a: 'SMEs with a Luxembourg business permit and a registered office in Luxembourg that meet the SME criteria, for a project in an eligible area scoped between EUR 3,000 and EUR 25,000 excluding VAT.',
    },
    {
      q: 'How much do I get back?',
      a: 'The programme reimburses 70% of the eligible project cost. A EUR 10,000 project means about EUR 7,000 back, so it costs your company roughly EUR 3,000 net. Only up to EUR 25,000 of cost counts toward the grant.',
    },
    {
      q: 'When do I receive the grant?',
      a: 'After the project is delivered. Your company pays the provider first, then the Ministry of the Economy reimburses 70%. It is a reimbursement, not an upfront payment.',
    },
    {
      q: 'What can it fund?',
      a: 'Eligible areas include website and e-commerce creation, digital and social marketing, AI initiatives, management systems and ERP, and e-invoicing, among others such as customer experience, energy transition and cybersecurity.',
    },
    {
      q: 'Do you guarantee approval?',
      a: 'No. No provider can guarantee a grant, since the Ministry of the Economy decides. What we do is only take on projects we believe qualify, and help you prepare a clean application.',
    },
  ],
});
