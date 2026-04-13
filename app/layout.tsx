import type { Metadata } from 'next'
import 'katex/dist/katex.min.css'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Henrique M Turqueti',
  description: 'Portfólio de projetos, estudos e posts sobre ciência de dados e analytics.',
  icons: {
    icon: '/images/branding/favicon.ico',
    shortcut: '/images/branding/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Display:ital,wght@0,100..900;1,100..900&family=Noto+Sans+Mono:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="site-shell">
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
