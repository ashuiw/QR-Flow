import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QRFlow — Free QR Code Generator',
  description: 'Create beautiful and customizable QR codes instantly for URLs, text, Wi-Fi, contacts, email, phone numbers and more.',
  generator: 'QRFlow',
  metadataBase: new URL('https://qrflow.app'),
  openGraph: { title: 'QRFlow — Free QR Code Generator', description: 'Create beautiful QR codes instantly. No signup, no tracking.', type: 'website', siteName: 'QRFlow' },
  twitter: { card: 'summary_large_image', title: 'QRFlow — Free QR Code Generator', description: 'Create beautiful QR codes instantly. No signup, no tracking.' },
}

export const viewport: Viewport = { colorScheme: 'light dark', themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f8f7f4' }, { media: '(prefers-color-scheme: dark)', color: '#15131a' }], userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
