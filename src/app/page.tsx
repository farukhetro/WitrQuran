import { Metadata } from 'next';
import styles from './page.module.css';
import SurahCard from '@/components/ui/SurahCard';
import LastListened from '@/components/widgets/LastListened';
import QuoteCard from '@/components/widgets/QuoteCard';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import surahsData from '@/data/surahs.json';
import { Surah } from '@/types/surah';
import Image from 'next/image';

import singLyricsImg from '../../Logos/Mini Logos/Sing Lyrics.png';
import browseSurahsImg from '../../Logos/Mini Logos/Browse Surahs.png';
import soundImg from '../../Logos/Mini Logos/Sound.png';

export const metadata: Metadata = {
  title: 'Listen to the Holy Quran | WITRQURAN',
  description: 'Listen to the Holy Quran online for free. Premium, distraction-free audio experience with 114 Surahs. No registration, no ads, completely free forever.',
  alternates: {
    canonical: 'https://witrquran.vercel.app',
  }
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Listen to the Holy Quran | WITRQURAN',
    description: 'Listen to the Holy Quran online for free.',
    url: 'https://witrquran.vercel.app',
  };

  return (
    <div className={styles.container}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Listen to the <span className={styles.highlightText}>Quran</span></h1>
        <p className={styles.subtitle}>
          Listen to the Surahs of the Holy Quran<br/>
          with clarity and peace.
        </p>

        {/* Big CTA Card */}
        <div className={styles.heroCard}>
          <div className={styles.decorativeLine} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: '0 0 70px', height: '1px', backgroundColor: 'var(--border)' }}></div>
            <Image src={singLyricsImg} alt="Sing Lyrics" width={32} height={32} style={{ opacity: 0.8 }} />
            <div style={{ flex: '0 0 70px', height: '1px', backgroundColor: 'var(--border)' }}></div>
          </div>
          <h2 className={styles.cardTitle}>Listen to Any Surah</h2>
          <p className={styles.cardSubtitle}>Choose any Surah from the Quran and listen with a clear heart.</p>
          <Link href="/surahs">
            <Button size="lg" icon={
              <Image src={browseSurahsImg} alt="Browse" width={20} height={20} />
            }>
              Browse Surahs
            </Button>
          </Link>
        </div>
      </section>

      {/* Surahs Section */}
      <section className={styles.surahsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <Image src={soundImg} alt="Sound" width={24} height={24} />
          </div>
          <h2>All Surahs</h2>
          <p>Select any Surah to listen</p>
        </div>

        <div className={styles.surahGrid}>
          {(surahsData as Surah[]).slice(0, 10).map((surah) => (
            <SurahCard 
              key={surah.id}
              number={surah.id}
              slug={surah.slug}
              englishName={surah.transliteration}
              translation={surah.englishName}
            />
          ))}
        </div>

        <div className={styles.viewMoreWrapper}>
          <Link href="/surahs">
            <Button variant="outline" className={styles.viewMoreBtn}>
              View More Surahs
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '0.5rem'}}>
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </Link>
        </div>
      </section>

      {/* Widgets Section */}
      <section className={styles.widgetsSection}>
        <LastListened />
        <QuoteCard />
      </section>
    </div>
  );
}
