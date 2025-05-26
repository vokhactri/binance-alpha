import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import Dashboard from '@/components/layout/dashboard'
import Footer from '@/components/layout/footer'
import Providers from './providers'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Binance Alpha',
  description: 'Binance Alpha trading statistics',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="container mx-auto py-8 px-4">
        <Dashboard>{children}</Dashboard>
        <Footer />
          </div>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}
