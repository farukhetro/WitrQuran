'use client';
import { useState, useEffect } from 'react';
import styles from './QuoteCard.module.css';
import { getDailyQuote, DailyQuote } from '@/utils/dailyQuote';

interface QuoteCardProps {
  quote?: string;
  surahName?: string;
  surahSlug?: string;
  ayah?: string;
}

export default function QuoteCard(props: QuoteCardProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const [error, setError] = useState<boolean>(false);
  
  // Only calculate daily quote on the client to avoid SSR hydration mismatch
  const loadDailyQuote = () => {
    try {
      setError(false);
      setDailyQuote(getDailyQuote());
    } catch (e) {
      console.error("Failed to load daily quote:", e);
      setError(true);
    }
  };

  useEffect(() => {
    if (!props.quote) {
      loadDailyQuote();
      
      // Update quote when crossing midnight
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const timeToMidnight = tomorrow.getTime() - now.getTime();
      
      const timer = setTimeout(() => {
        loadDailyQuote();
        // Set an interval for subsequent midnights
        setInterval(loadDailyQuote, 24 * 60 * 60 * 1000);
      }, timeToMidnight);
      
      return () => clearTimeout(timer);
    }
  }, [props.quote]);

  // Determine final display values (props override daily quote)
  const displayQuote = props.quote || dailyQuote?.text;
  const displaySurahName = props.surahName || dailyQuote?.surahName;
  const displaySurahSlug = props.surahSlug || dailyQuote?.surahSlug;
  const displayAyah = props.ayah || dailyQuote?.ayah;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getShareText = (isCopy: boolean) => {
    if (!displayQuote) return '';
    
    const cleanQuote = displayQuote.replace(/\n/g, ' ');
    const url = displaySurahSlug ? `https://witrquran.vercel.app/surah/${displaySurahSlug}` : 'https://witrquran.vercel.app';
    
    let reference = '';
    if (displaySurahName) {
      reference = `\n\n— ${displaySurahName}`;
      if (displayAyah) {
        reference += ` (${displayAyah})`;
      }
    }
    
    if (isCopy) {
      return `"${cleanQuote}"${reference}\n\nListen on WITRQURAN:\n${url}`;
    } else {
      return `"${cleanQuote}"${reference}\n\nListen here:\n${url}`;
    }
  };

  const handleCopyFallback = async () => {
    try {
      await navigator.clipboard.writeText(getShareText(true));
      showToast('✓ Quote copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    const url = displaySurahSlug ? `https://witrquran.vercel.app/surah/${displaySurahSlug}` : 'https://witrquran.vercel.app';
    const text = getShareText(false);

    const fullShareData = {
      title: 'Listen to the Holy Quran on WITRQURAN',
      text: text,
      url: url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(fullShareData)) {
      try {
        await navigator.share(fullShareData);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          handleCopyFallback();
        }
      }
    } else {
      handleCopyFallback();
    }
  };

  const handleCopy = () => {
    handleCopyFallback();
  };

  if (error && !props.quote) {
    return (
      <div className={styles.card}>
        <div className={styles.content}>
          <p className={styles.quoteText} style={{ fontSize: '1.2rem', color: 'var(--muted)' }}>
            Unable to load today's Quran quote.
          </p>
          <button className={styles.actionBtn} onClick={loadDailyQuote} style={{ marginTop: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Skeleton / Loading state before hydration
  if (!displayQuote) {
    return (
      <div className={styles.card}>
        <div className={styles.content} style={{ opacity: 0.3 }}>
          <div className={styles.quoteTextContainer}>
            <p className={styles.quoteText}>Loading today's quote...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card} style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className={styles.content}>
        <div className={styles.quoteTextContainer}>
          <p 
            className={styles.quoteText} 
            style={{ fontSize: displayQuote.length > 120 ? '1.15rem' : (displayQuote.length > 70 ? '1.3rem' : '1.5rem') }}
          >
            {displayQuote.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
          {displaySurahName && (
            <div className={styles.surahInfo}>
              <span className={styles.surahName}>{displaySurahName}</span>
              {displayAyah && <span className={styles.ayahNum}> ({displayAyah})</span>}
            </div>
          )}
        </div>
        <div className={styles.referenceContainer}>
          <div className={styles.diamond}></div>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={handleShare} aria-label="Share Quote">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 6L12 2L8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Share
        </button>
        <button className={styles.actionBtn} onClick={handleCopy} aria-label="Copy Quote">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H16C17.1046 21 18 20.1046 18 19V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 5C8 6.10457 8.89543 7 10 7H12C13.1046 7 14 6.10457 14 5M8 5C8 3.89543 8.89543 3 10 3H12C13.1046 3 14 3.89543 14 5M14 5H16C17.1046 5 18 5.89543 18 7V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 14L18 12M18 12L20 14M18 12V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="translate(2, 0)"/>
          </svg>
          Copy
        </button>
      </div>

      <div className={`${styles.toast} ${toastMessage ? styles.toastVisible : ''}`}>
        {toastMessage}
      </div>

      {/* Decorative Floral Backgrounds */}
      <div className={`${styles.decoration} ${styles.decLeft}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100C0 44.7715 44.7715 0 100 0V100H0Z" fill="var(--highlight)" opacity="0.05"/>
          <path d="M0 100C0 61.3401 31.3401 30 70 30V100H0Z" fill="var(--highlight)" opacity="0.1"/>
        </svg>
      </div>
      <div className={`${styles.decoration} ${styles.decRight}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 0C100 55.2285 55.2285 100 0 100V0H100Z" fill="var(--highlight)" opacity="0.05"/>
          <path d="M100 0C100 38.6599 68.6599 70 30 70V0H100Z" fill="var(--highlight)" opacity="0.1"/>
        </svg>
      </div>
    </div>
  );
}
