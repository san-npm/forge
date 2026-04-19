'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import WebMcpTools from '@/components/WebMcpTools';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <WebMcpTools />
      {children}
    </LanguageProvider>
  );
}
