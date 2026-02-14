import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Forge — Simulateur aides Luxembourg',
  description: 'Découvrez combien le Luxembourg finance votre transformation digitale & IA. Simulez vos aides en 2 minutes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
