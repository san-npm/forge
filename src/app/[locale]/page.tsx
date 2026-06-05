import type { Metadata } from 'next';
import OpenletzOS from '@/components/os/OpenletzOS';
import CrawlableContent from '@/components/os/CrawlableContent';
import '@/app/os/os.css';

export const metadata: Metadata = {
  title: { absolute: 'Openletz — AI & Web3 Studio · Luxembourg' },
  description:
    'A Luxembourg AI & Web3 studio. We build websites that think, move and transact — AI automation, on-chain products and growth.',
};

export default function Home() {
  return (
    <>
      <OpenletzOS />
      <CrawlableContent />
    </>
  );
}
