import { StudioSchema, type Studio } from '@/lib/schema';

export type { Studio };

// Ported verbatim from src/components/os/osData.ts (STUDIO).
export const STUDIO: Studio = StudioSchema.parse({
  name: 'Openletz',
  tagline: 'Websites that think, move & transact.',
  sub: 'A Luxembourg AI agency.',
  welcomeLead:
    "We're a small Luxembourg studio. We build AI agents, chatbots and automations that actually save time, plus the websites and shops around them. When a project needs blockchain, we build that too. Everything runs in Europe, and it's yours to keep.",
  hint: 'Double-click an icon to see what we do, or hit "New Project" to start.',
});
