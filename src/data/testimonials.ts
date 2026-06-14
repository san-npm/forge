import type { Testimonial } from '@/lib/schema';
import { TestimonialsSchema } from '@/lib/schema';

// OWNER-PROVIDED: replace these placeholders with real, attributable quotes
// (name + role + company). Until then the array MAY contain placeholder entries
// that are clearly marked; ship with [] if no real quote is approved.
// To go live with zero testimonials, set: const raw: Testimonial[] = [];
const raw: Testimonial[] = [
  {
    quote: 'OWNER-PROVIDED: a real client quote about working with Openletz goes here.',
    name: 'OWNER-PROVIDED: Client name',
    role: 'OWNER-PROVIDED: Role',
    company: 'OWNER-PROVIDED: Company',
    // photo: '/testimonials/owner-provided.jpg', // optional headshot
  },
];

export const TESTIMONIALS: Testimonial[] = TestimonialsSchema.parse(raw);
