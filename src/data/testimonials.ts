import type { Testimonial } from '@/lib/schema';
import { TestimonialsSchema } from '@/lib/schema';

// Ships empty until the owner approves real, attributable quotes.
// Add entries shaped like:
//   { quote: '…', name: 'Jane Doe', role: 'Owner', company: 'Vins Fins',
//     photo: '/testimonials/jane.jpg' /* optional headshot */ }
const raw: Testimonial[] = [];

export const TESTIMONIALS: Testimonial[] = TestimonialsSchema.parse(raw);
