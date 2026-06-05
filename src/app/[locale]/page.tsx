import type { Metadata } from 'next';
import OpenletzOS from '@/components/os/OpenletzOS';
import CrawlableContent from '@/components/os/CrawlableContent';
import '@/app/os/os.css';

export const metadata: Metadata = {
  title: { absolute: 'Openletz — Luxembourg AI Agency · AI agents, chatbots & automation' },
  description:
    'Luxembourg AI agency. We build custom AI agents, chatbots and automation for business — plus websites and growth — GDPR & EU AI Act ready. We also build Web3 when a product needs it.',
  keywords: [
    'AI agency Luxembourg', 'agence IA Luxembourg', 'AI automation Luxembourg',
    'AI agents Luxembourg', 'chatbot IA entreprise Luxembourg', 'AI consulting Luxembourg',
    'KI Agentur Luxemburg', 'outils IA RGPD', 'EU AI Act',
  ],
};

export default function Home() {
  return (
    <>
      <OpenletzOS />
      <CrawlableContent />
    </>
  );
}
