import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CornerDecorations from "@/components/layout/CornerDecorations";
import ScrollToTop from "@/components/layout/ScrollToTop";
import PwaRegister from "@/components/pwa/PwaRegister";

export const viewport: Viewport = {
  themeColor: '#121212',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    template: '%s | WITRQURAN',
    default: 'WITRQURAN - Free Online Quran Listening',
  },
  description: 'Listen to the Holy Quran online for free. Premium, distraction-free audio experience with 114 Surahs. No registration, no ads, completely free forever.',
  metadataBase: new URL('https://witrquran.vercel.app'),
  applicationName: 'WITRQURAN',
  authors: [{ name: 'Md Faruk Abdulla' }],
  generator: 'Next.js',
  keywords: ['Quran', 'Listen Quran', 'Holy Quran', 'Quran Audio', 'Islam', 'Free Quran', 'WITRQURAN'],
  creator: 'Md Faruk Abdulla',
  publisher: 'WITRQURAN',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'WITRQURAN - Free Online Quran Listening',
    description: 'Listen to the Holy Quran online for free. Premium, distraction-free audio experience with 114 Surahs.',
    url: 'https://witrquran.vercel.app',
    siteName: 'WITRQURAN',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'WITRQURAN Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WITRQURAN - Free Online Quran Listening',
    description: 'Listen to the Holy Quran online for free. Premium, distraction-free audio experience.',
    creator: '@witrquran', // placeholder
    images: ['/android-chrome-512x512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WITRQURAN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'WITRQURAN',
      url: 'https://witrquran.vercel.app',
      description: 'Listen to the Holy Quran online for free.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://witrquran.vercel.app/surahs?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'WITRQURAN',
      url: 'https://witrquran.vercel.app',
      logo: 'https://witrquran.vercel.app/logo.png',
      founder: {
        '@type': 'Person',
        name: 'Md Faruk Abdulla'
      }
    }
  ];

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <PwaRegister />
        <ScrollToTop />
        <div style={{ position: 'relative', zIndex: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <CornerDecorations position="top" />
          <Navbar />
          <main style={{ flex: 1, position: 'relative' }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
