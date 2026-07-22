'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SurahDrawer.module.css';
import surahsData from '@/data/surahs.json';
import { Surah } from '@/types/surah';

interface SurahDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function SurahDrawer({ isOpen, onClose, onMouseEnter, onMouseLeave }: SurahDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const surahs = surahsData as Surah[];

  const currentSurahSlug = pathname?.startsWith('/surah/') 
    ? pathname.replace('/surah/', '') 
    : null;

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;
    
    const query = searchQuery.toLowerCase();
    return surahs.filter(surah => 
      surah.englishName.toLowerCase().includes(query) ||
      surah.transliteration.toLowerCase().includes(query) ||
      surah.arabicName.includes(query) ||
      surah.id.toString() === query
    );
  }, [searchQuery, surahs]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div 
      className={`${styles.drawerWrapper} ${isOpen ? styles.open : ''}`}
    >
      {/* Mobile backdrop */}
      <div className={`${styles.backdrop} ${isOpen ? styles.open : ''}`} onClick={onClose} />

      <div 
        className={styles.drawer}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Surah</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search Surah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.surahList}>
          {filteredSurahs.map((surah) => {
            const isActive = currentSurahSlug === surah.slug;
            return (
              <Link 
                href={`/surah/${surah.slug}`} 
                key={surah.id}
                className={`${styles.surahItem} ${isActive ? styles.active : ''}`}
                onClick={onClose}
              >
                <div className={styles.surahNumber}>
                  {isActive ? (
                    <div className={styles.playingIndicator}>
                      <div className={styles.bar}></div>
                      <div className={styles.bar}></div>
                      <div className={styles.bar}></div>
                    </div>
                  ) : (
                    surah.id
                  )}
                </div>
                <div className={styles.surahInfo}>
                  <span className={styles.englishName}>{surah.transliteration}</span>
                  <span className={styles.translatedName}>{surah.englishName}</span>
                </div>
                <div className={styles.arabicName}>{surah.arabicName}</div>
              </Link>
            );
          })}
          
          {filteredSurahs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)' }}>
              No Surahs found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
