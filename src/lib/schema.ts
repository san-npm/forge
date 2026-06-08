import { z } from 'zod';
import { LOCALES } from '@/lib/site-config';

/* ----------------------------------------------------------------------------
 * Locale
 * ------------------------------------------------------------------------- */
export const LocaleSchema = z.enum(LOCALES); // ['en','fr','de']

/* ----------------------------------------------------------------------------
 * Data-module schemas (ported from osData.ts) — each *Schema parses its data
 * module at load so malformed content fails the build.
 * ------------------------------------------------------------------------- */
export const StudioSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  sub: z.string().min(1),
  welcomeLead: z.string().min(1),
  hint: z.string().min(1),
});
export type Studio = z.infer<typeof StudioSchema>;

export const ServiceKeySchema = z.enum(['ai', 'web3', 'marketing']);
export type ServiceKey = z.infer<typeof ServiceKeySchema>;

export const ServiceDataSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  lead: z.string(),
  what: z.array(z.object({ t: z.string(), d: z.string() })),
  how: z.array(z.string()),
  proof: z.string(),
  footer: z.string().optional(),
});
export type ServiceData = z.infer<typeof ServiceDataSchema>;

export const ServicesSchema = z.record(ServiceKeySchema, ServiceDataSchema);

export const WorkItemSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  kind: z.string(),
  link: z.string().url(),
  blurb: z.string(),
  about: z.string(),
  did: z.array(z.string()),
  stack: z.array(z.string()),
  tag: z.enum(['ai', 'web', 'web3']).optional(),
});
export type WorkItem = z.infer<typeof WorkItemSchema>;

export const WorkSchema = z.array(WorkItemSchema).length(6);

export const AboutSchema = z.object({
  bioLead: z.string(),
  founderName: z.string(),
  founderRole: z.string(),
  facts: z.array(z.string()).length(3),
  entity: z.string(),
});
export type About = z.infer<typeof AboutSchema>;

export const ContactDataSchema = z.object({
  lead: z.string(),
  types: z.array(z.string()).length(4),
  callLine: z.string(),
});
export type Contact = z.infer<typeof ContactDataSchema>;

export const IconKeySchema = z.enum([
  'mac',
  'ai',
  'web3',
  'growth',
  'folder',
  'about',
  'mail',
  'doc',
  'drive',
  'disk',
  'price',
  'tools',
  'insights',
  'sketch',
  'snake',
]);
export type IconKey = z.infer<typeof IconKeySchema>;

export const PriceTierSchema = z.object({
  name: z.string(),
  icon: IconKeySchema,
  price: z.string(),
  desc: z.string(),
  feats: z.array(z.string()).length(3),
  highlight: z.boolean().optional(),
});
export type PriceTier = z.infer<typeof PriceTierSchema>;

export const PricingSchema = z.object({
  lead: z.string(),
  tiers: z.array(PriceTierSchema).length(4),
  note: z.string(),
});
export type Pricing = z.infer<typeof PricingSchema>;

export const HeroSchema = z.object({
  tagline: z.string(),
  sub: z.string(),
  welcomeLead: z.string(),
  hint: z.string(),
  newProject: z.string(),
  seeWork: z.string(),
});
export type Hero = z.infer<typeof HeroSchema>;

export const HeroI18nSchema = z.record(LocaleSchema, HeroSchema);

/* ----------------------------------------------------------------------------
 * Nav + Footer data-module schemas (src/data/nav.ts). The flat nav is 4 links;
 * the persistent "Start a project" CTA is carried separately (START_PROJECT).
 * The footer is exactly 4 columns (spec §6). Each parses at load.
 * ------------------------------------------------------------------------- */
export const NavItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});
export type NavItem = z.infer<typeof NavItemSchema>;

export const NavSchema = z.array(NavItemSchema);

export const FooterColumnSchema = z.object({
  heading: z.string().min(1),
  links: z.array(NavItemSchema),
});
export type FooterColumn = z.infer<typeof FooterColumnSchema>;

export const FooterSchema = z.array(FooterColumnSchema).length(4);

/* ----------------------------------------------------------------------------
 * Proof-strip descriptor schemas (src/data/proof.ts). NO fabricated numbers:
 * live metrics carry `value: null, live: true` and are filled at runtime by
 * Phase-2's src/lib/proof.ts. Each parses at load.
 * ------------------------------------------------------------------------- */
export const ProofLogoSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  src: z.string().min(1),
  href: z.string().url(),
});
export type ProofLogo = z.infer<typeof ProofLogoSchema>;

export const ProofMetricSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.number().nullable(),
  suffix: z.string().optional(),
  live: z.boolean().optional(),
});
export type ProofMetric = z.infer<typeof ProofMetricSchema>;

/* ----------------------------------------------------------------------------
 * Section discriminated union — TYPES ONLY. Each variant carries only its own
 * props. SectionRenderer (Phase 2) switches on `type` with a `never` default.
 * NOTE: there is NO 'footer' variant — Nav, Footer and NewsletterForm are
 * layout-level components rendered ONCE in src/app/[locale]/layout.tsx.
 * ------------------------------------------------------------------------- */
export type SectionType =
  | 'hero'
  | 'proofStrip'
  | 'servicesGrid'
  | 'howWeWork'
  | 'selectedWork'
  | 'deeperProof'
  | 'trustBlock'
  | 'enquiryForm';

// supporting shapes
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  photo?: string;
}

export interface HeroSectionProps {
  type: 'hero';
  h1: string;
  sub: string;
  lead: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export interface ProofStripSectionProps {
  type: 'proofStrip';
  label: string;
  logos: ProofLogo[];
  metrics: ProofMetric[];
}

export interface ServicesGridSectionProps {
  type: 'servicesGrid';
  order: ServiceKey[];
  ctaLabel: string;
  ctaHref: string;
}

export interface HowWeWorkSectionProps {
  type: 'howWeWork';
  steps: string[];
  smePackageNote: string;
  stickyScroll?: boolean;
}

export interface SelectedWorkSectionProps {
  type: 'selectedWork';
  items: WorkItem[];
  viewAllHref: string;
}

export interface DeeperProofSectionProps {
  type: 'deeperProof';
  shippedCount: number;
  metrics: ProofMetric[];
  testimonials: Testimonial[];
}

export interface TrustBlockSectionProps {
  type: 'trustBlock';
  facts: string[];
  headline?: string;
}

export interface EnquiryFormSectionProps {
  type: 'enquiryForm';
  id: 'enquiry';
  headline: string;
  pillars: string[];
  callLine: string;
  bookCallHref: string;
}

export type Section =
  | HeroSectionProps
  | ProofStripSectionProps
  | ServicesGridSectionProps
  | HowWeWorkSectionProps
  | SelectedWorkSectionProps
  | DeeperProofSectionProps
  | TrustBlockSectionProps
  | EnquiryFormSectionProps;

/* ----------------------------------------------------------------------------
 * Runtime payload schemas (client ⇄ API single source of truth)
 * ------------------------------------------------------------------------- */
export const ContactPayloadSchema = z.object({
  name: z.string().trim().min(1).max(500),
  email: z
    .string()
    .trim()
    .max(500)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  phone: z.string().trim().max(500).optional(),
  company: z.string().trim().max(500).optional(),
  companySize: z.enum(['solo', '1-10', '11-50', '51-250', '250+']).optional(),
  pillar: z
    .enum(['AI automation', 'Web3 / on-chain', 'Website & growth', 'Not sure yet'])
    .optional(),
  budget: z.enum(['<5k', '5-15k', '15-50k', '50k+', 'unsure']).optional(),
  message: z.string().trim().max(2000).optional(),
});
export type ContactPayload = z.infer<typeof ContactPayloadSchema>;

export const NewsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .max(500)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
});
export type NewsletterPayload = z.infer<typeof NewsletterSchema>;
