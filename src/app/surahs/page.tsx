'use client';

import { useState } from 'react';
import styles from './page.module.css';
import SurahCard from '@/components/ui/SurahCard';
import surahsData from '@/data/surahs.json';
import { Surah } from '@/types/surah';

export default function SurahsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = (surahsData as Surah[]).filter((surah) => {
    const query = searchQuery.toLowerCase();
    return (
      surah.englishName.toLowerCase().includes(query) ||
      surah.arabicName.toLowerCase().includes(query) ||
      surah.transliteration.toLowerCase().includes(query) ||
      surah.id.toString().includes(query)
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18V5L21 3V16" stroke="var(--highlight)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z" stroke="var(--highlight)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 19C19.6569 19 21 17.6569 21 16C21 14.3431 19.6569 13 18 13C16.3431 13 15 14.3431 15 16C15 17.6569 16.3431 19 18 19Z" stroke="var(--highlight)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className={styles.title}>All Surahs</h1>
        <p className={styles.subtitle}>Select any Surah to listen</p>
      </div>

      <div className={styles.searchBar}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 21L16.65 16.65" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input 
          type="text" 
          placeholder="Search Surah by name or number..." 
          className={styles.searchInput} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {filteredSurahs.map((surah) => (
          <SurahCard 
            key={surah.id}
            number={surah.id}
            slug={surah.slug}
            englishName={surah.transliteration}
            translation={surah.englishName}
          />
        ))}
      </div>
      
      {filteredSurahs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
          No Surahs found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
