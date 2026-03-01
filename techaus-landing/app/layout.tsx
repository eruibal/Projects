import type { Metadata } from 'next'
import { Montserrat, Open_Sans } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '600', '700'],
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '600'],
})

export const metadata: Metadata = {
  title: 'Techaus - Protección Integral y Cloud Services',
  description: 'Seguros personales, de auto, vida y hogar con el respaldo de profesionales en México.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="font-sans text-slate-600 antialiased bg-slate-50">
        {children}
      </body>
    </html>
  )
}
