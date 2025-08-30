import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CosmicBadge from '@/components/CosmicBadge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cosmic 3D Portfolio Gallery',
  description: 'An immersive 3D portfolio gallery built with React Three Fiber showcasing creative work in a stunning three-dimensional space.',
  keywords: ['portfolio', '3D', 'React Three Fiber', 'Three.js', 'Next.js', 'WebGL'],
  authors: [{ name: 'Cosmic' }],
  openGraph: {
    title: 'Cosmic 3D Portfolio Gallery',
    description: 'Navigate through floating project cards in a cosmic 3D environment',
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=630&fit=crop&auto=format'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cosmic 3D Portfolio Gallery',
    description: 'Navigate through floating project cards in a cosmic 3D environment',
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=630&fit=crop&auto=format'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en" className="dark">
      <head>
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js" />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-background">
          {children}
        </main>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  )
}