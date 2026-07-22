import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Surahs',
  description: 'Browse and listen to all 114 Surahs of the Holy Quran. High-quality audio recitation available for free.',
  alternates: {
    canonical: 'https://witrquran.vercel.app/surahs',
  }
};

export default function SurahsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'All Surahs | WITRQURAN',
    description: 'Browse and listen to all 114 Surahs of the Holy Quran.',
    url: 'https://witrquran.vercel.app/surahs',
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
