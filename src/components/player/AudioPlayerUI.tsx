'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './AudioPlayerUI.module.css';
import Skeleton from '@/components/ui/Skeleton';
import { Surah } from '@/types/surah';
import { getAudioUrl } from '@/config';
import { storage } from '@/utils/storage';
import Image from 'next/image';
import surahPhoto from '../../../Logos/Mini Logos/Surah Photo.jpeg';
import { getDailyQuote, DailyQuote } from '@/utils/dailyQuote';

interface AudioPlayerUIProps {
  surah?: Surah;
  nextSurahSlug?: string;
  prevSurahSlug?: string;
}

export default function AudioPlayerUI({ surah, nextSurahSlug, prevSurahSlug }: AudioPlayerUIProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSurahIdRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLooping, setIsLooping] = useState(false);

  // Quote State
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);

  // Timer state
  const [sleepTimer, setSleepTimer] = useState<number | null>(null); // minutes
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSurahSlugRef = useRef(nextSurahSlug);
  const routerRef = useRef(router);

  useEffect(() => {
    nextSurahSlugRef.current = nextSurahSlug;
  }, [nextSurahSlug]);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    try {
      setDailyQuote(getDailyQuote());
    } catch (e) {
      console.error("Failed to load daily quote", e);
    }
  }, []);

  // One-time Setup & Cleanup
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.buffered.length > 0) {
        setBuffered(audio.buffered.end(audio.buffered.length - 1));
      }
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setErrorMsg(null);
    };
    const onEnded = () => {
      if (audio.loop) return;
      setIsPlaying(false);
      setTimeout(() => {
        if (nextSurahSlugRef.current) {
          routerRef.current.push(`/surah/${nextSurahSlugRef.current}`);
        }
      }, 0);
    };
    const onError = (e: Event) => {
      console.error('Audio Error:', e);
      setErrorMsg('Failed to load audio. Please check your connection and try again.');
      setIsPlaying(false);
      setIsBuffering(false);
    };
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
      setErrorMsg(null);
    };
    const onPause = () => {
      setIsPlaying(false);
      setIsBuffering(false);
    };
    const onCanPlay = () => setIsBuffering(false);
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('canplay', onCanPlay);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      currentSurahIdRef.current = null;
    };
  }, []);

  // Load new Surah
  useEffect(() => {
    if (!surah || !audioRef.current) return;

    const prefs = storage.getPreferences();
    setVolume(prefs.volume);
    setPlaybackRate(prefs.playbackRate);
    storage.addLastListened(surah);
    
    const audio = audioRef.current;

    if (currentSurahIdRef.current !== surah.id) {
      currentSurahIdRef.current = surah.id;
      
      audio.src = getAudioUrl(surah.id);
      audio.preload = 'metadata';
      audio.volume = prefs.volume;
      audio.playbackRate = prefs.playbackRate;
      
      setCurrentTime(0);
      setDuration(0);
      setBuffered(0);
      setErrorMsg(null);
      setIsBuffering(false);
      audio.load();

      setIsPlaying(false);
    }

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: surah.transliteration,
        artist: 'Mahmoud Khalil Al Hussary',
        album: 'Quran',
      });
      navigator.mediaSession.setActionHandler('play', () => audio.play().catch(console.error));
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('seekbackward', () => { audio.currentTime -= 15; });
      navigator.mediaSession.setActionHandler('seekforward', () => { audio.currentTime += 15; });
    }
  }, [surah, searchParams]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skip(15);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skip(-15);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const togglePlay = () => {
    if (!audioRef.current || errorMsg) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(e => {
        if (e.name !== 'AbortError') console.error("Playback failed:", e);
      });
    } else {
      audioRef.current.pause();
    }
  };

  const skip = (amount: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += amount;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = (clientX - rect.left) / rect.width;
    const time = pos * duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const cycleSpeed = () => {
    if (!audioRef.current) return;
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    
    audioRef.current.playbackRate = nextSpeed;
    setPlaybackRate(nextSpeed);
    storage.savePreferences({ volume, playbackRate: nextSpeed });
  };

  const toggleLoop = () => {
    if (!audioRef.current) return;
    const newLoop = !isLooping;
    audioRef.current.loop = newLoop;
    setIsLooping(newLoop);
  };

  const cycleTimer = () => {
    const timers = [null, 15, 30, 60];
    const currentIndex = timers.indexOf(sleepTimer);
    const nextTimer = timers[(currentIndex + 1) % timers.length];
    
    setSleepTimer(nextTimer);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    if (nextTimer !== null) {
      // Set timeout for the duration
      timerIntervalRef.current = setTimeout(() => {
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
        setSleepTimer(null);
      }, nextTimer * 60 * 1000);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return '00:00';
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m}:${s}`;
    return `${m}:${s}`;
  };

  if (!surah) {
    return <div className={styles.container}><Skeleton width="100%" height="100%" /></div>;
  }

  return (
    <div className={styles.container}>
      {/* Background Layers */}
      <div className={styles.heroBackground}></div>
      <div className={styles.heroPattern}></div>
      <div className={styles.surahArt}>
        <Image 
          src={surahPhoto} 
          alt="Quran Art" 
          fill 
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {errorMsg && (
        <div className={styles.errorOverlay}>
          <p>{errorMsg}</p>
          <button className={styles.retryBtn} onClick={() => {
            setErrorMsg(null);
            if (audioRef.current) {
              audioRef.current.load();
              audioRef.current.play().catch(console.error);
            }
          }}>
            Retry
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.playerContent}>
        
        <div className={styles.arabicTitle}>
          <span className={styles.titleDecoration}>❖</span>
          سورة {surah.arabicName}
          <span className={styles.titleDecoration}>❖</span>
        </div>
        
        <h1 className={styles.title}>{surah.transliteration}</h1>
        <div className={styles.subtitle}>{surah.englishName}</div>
        
        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <div className={styles.dividerIcon}>✦</div>
          <div className={styles.dividerLine}></div>
        </div>

        {dailyQuote && (
          <div className={styles.quoteContainer}>
            <div className={styles.quoteText}>"{dailyQuote.text}"</div>
            <div className={styles.quoteSource}>
              Surah {dailyQuote.surahName} • Ayah {dailyQuote.ayah}
            </div>
          </div>
        )}

        <div className={styles.progressSection}>
          <span className={styles.timeText}>{formatTime(currentTime)}</span>
          <div className={styles.progressBarWrapper} onClick={handleSeek}>
            <div className={styles.progressBuffer} style={{ width: `${(buffered / duration) * 100 || 0}%` }}></div>
            <div className={styles.progressFill} style={{ width: `${(currentTime / duration) * 100 || 0}%` }}></div>
          </div>
          <span className={styles.timeText}>{formatTime(duration)}</span>
        </div>

        <div className={styles.controlsRow}>
          {/* Speed */}
          <button className={styles.controlBtn} onClick={cycleSpeed} aria-label="Playback Speed">
            <span style={{ fontSize: '1.2rem', fontWeight: 500, fontFamily: 'var(--font-mono, monospace)' }}>
              {playbackRate}x
            </span>
            <span className={styles.controlLabel}>Speed</span>
          </button>

          {/* Previous */}
          <button 
            className={styles.navTrackBtn} 
            onClick={() => prevSurahSlug && router.push(`/surah/${prevSurahSlug}`)}
            disabled={!prevSurahSlug}
            aria-label="Previous Surah"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 18L5 12L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 18L13 12L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 18V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <div className={styles.playBtnWrapper}>
            {isPlaying && <div className={styles.playBtnRing}></div>}
            {isPlaying && <div className={styles.playBtnRing2}></div>}
            <button 
              className={`${styles.playBtn} ${isPlaying ? styles.playing : ''}`} 
              onClick={togglePlay} 
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6H7V18H10V6Z" />
                  <path d="M17 6H14V18H17V6Z" />
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5V19L19 12L8 5Z" />
                </svg>
              )}
            </button>
          </div>

          {/* Next */}
          <button 
            className={styles.navTrackBtn} 
            onClick={() => nextSurahSlug && router.push(`/surah/${nextSurahSlug}`)}
            disabled={!nextSurahSlug}
            aria-label="Next Surah"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 18L19 12L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 18L11 12L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 18V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Repeat */}
          <button className={styles.controlBtn} onClick={toggleLoop} style={{ color: isLooping ? '#D4AF37' : '' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 1L21 5L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 23L3 19L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.controlLabel}>Repeat</span>
          </button>

          {/* Sleep Timer */}
          <button className={styles.controlBtn} onClick={cycleTimer} style={{ color: sleepTimer ? '#D4AF37' : '' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.controlLabel}>{sleepTimer ? `${sleepTimer}m` : 'Timer'}</span>
          </button>

        </div>

        <div className={styles.branding}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          WITRQURAN
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
