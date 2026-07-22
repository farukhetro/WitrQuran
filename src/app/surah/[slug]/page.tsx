import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './page.module.css';
import AudioPlayerUI from '@/components/player/AudioPlayerUI';
import { getAudioUrl } from '@/config';
import LastListened from '@/components/widgets/LastListened';
import QuoteCard from '@/components/widgets/QuoteCard';
import surahsData from '@/data/surahs.json';
import { Surah } from '@/types/surah';

export async function generateStaticParams() {
  return (surahsData as Surah[]).map((surah) => ({
    slug: surah.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const surahs = surahsData as Surah[];
  const surah = surahs.find((s) => s.slug === params.slug);
  
  if (!surah) return {};

  return {
    title: `Surah ${surah.transliteration} (${surah.arabicName})`,
    description: `Listen to Surah ${surah.transliteration} (${surah.englishName}). Revealed in ${surah.revelationType}, containing ${surah.totalAyahs} ayahs. Free high-quality audio recitation.`,
    alternates: {
      canonical: `https://witrquran.vercel.app/surah/${surah.slug}`,
    },
    openGraph: {
      title: `Surah ${surah.transliteration} - WITRQURAN`,
      description: `Listen to Surah ${surah.transliteration} (${surah.englishName}) for free.`,
      url: `https://witrquran.vercel.app/surah/${surah.slug}`,
      siteName: 'WITRQURAN',
    }
  };
}

export default function SurahPlayerPage({ params }: { params: { slug: string } }) {
  const surahs = surahsData as Surah[];
  const currentIndex = surahs.findIndex((s) => s.slug === params.slug);

  if (currentIndex === -1) {
    notFound();
  }

  const surah = surahs[currentIndex];
  const prevSurah = currentIndex > 0 ? surahs[currentIndex - 1] : null;
  const nextSurah = currentIndex < surahs.length - 1 ? surahs[currentIndex + 1] : null;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://witrquran.vercel.app' },
        { '@type': 'ListItem', position: 2, name: 'Surahs', item: 'https://witrquran.vercel.app/surahs' },
        { '@type': 'ListItem', position: 3, name: surah.transliteration, item: `https://witrquran.vercel.app/surah/${surah.slug}` }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'AudioObject',
      name: `Surah ${surah.transliteration} Recitation`,
      description: `Audio recitation of Surah ${surah.transliteration} (${surah.englishName})`,
      encodingFormat: 'audio/mpeg', // most audio is mpeg/mp3
      contentUrl: getAudioUrl(surah.id),
      duration: 'PT0M0S', // Ideal to calculate dynamically if possible, but leaving generic if not
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `Surah ${surah.transliteration} - Listen Online | WITRQURAN`,
      description: `Listen to Surah ${surah.transliteration} (${surah.englishName}). Revealed in ${surah.revelationType}, containing ${surah.totalAyahs} ayahs.`,
      url: `https://witrquran.vercel.app/surah/${surah.slug}`,
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.heroContainer}>
        <Suspense fallback={<div className={styles.heroContainer} style={{height: '80vh'}}>Loading player...</div>}>
          <AudioPlayerUI 
            surah={surah} 
            nextSurahSlug={nextSurah?.slug} 
            prevSurahSlug={prevSurah?.slug}
          />
        </Suspense>
      </div>

      <div className={styles.container}>
        <section className={styles.widgetsSection}>
          <LastListened />
          <QuoteCard surahName={`Surah ${surah.transliteration}`} surahSlug={surah.slug} />
        </section>
      </div>
    </>
  );
}
