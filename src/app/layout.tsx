import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Banner Generator',
  description: 'Generate banners for various ad platforms',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 