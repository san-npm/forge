import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'

export const metadata: Metadata = {
  title: 'Forge — Simulateur aides Luxembourg / Luxembourg Grants Simulator',
  description: 'Simulez vos aides à la digitalisation et IA au Luxembourg. Gratuit, 6 langues. / Simulate your digitalization and AI grants in Luxembourg. Free, 6 languages.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
