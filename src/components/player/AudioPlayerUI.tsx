'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './AudioPlayerUI.module.css';
import Skeleton from '@/components/ui/Skeleton';
import { Surah } from '@/types/surah';
import { getAudioUrl } from '@/config';
import { storage } from '@/utils/storage';
import SurahDrawer from '@/components/navigation/SurahDrawer';

const getPremiumArtwork = (id: number) => {
  const hue1 = (id * 137.508) % 360;
  const hue2 = (hue1 + 45 + (id * 17) % 60) % 360;
  
  const color1 = `hsl(${hue1}, 35%, 12%)`;
  const color2 = `hsl(${hue2}, 45%, 8%)`;
  
  const colorGlow = `hsl(${hue1}, 50%, 30%)`;
  const colorGold = `rgba(212, 175, 55, 0.5)`; 

  const compType = id % 4; 
  
  const pos1X = 20 + ((id * 43) % 60);
  const pos1Y = 20 + ((id * 53) % 60);
  const pos2X = 80 - ((id * 23) % 60);
  const pos2Y = 80 - ((id * 73) % 60);

  return { color1, color2, colorGlow, colorGold, compType, pos1X, pos1Y, pos2X, pos2Y };
};

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



  // Timer state
  const [sleepTimer, setSleepTimer] = useState<number | null>(null); // minutes
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEdgeEnter = useCallback(() => {
    if (window.innerWidth >= 1024) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      openTimeoutRef.current = setTimeout(() => setIsDrawerOpen(true), 150);
    }
  }, []);

  const handleEdgeLeave = useCallback(() => {
    if (window.innerWidth >= 1024) {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      closeTimeoutRef.current = setTimeout(() => setIsDrawerOpen(false), 200);
    }
  }, []);

  const handleDrawerEnter = useCallback(() => {
    if (window.innerWidth >= 1024) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    }
  }, []);

  const handleDrawerLeave = useCallback(() => {
    if (window.innerWidth >= 1024) {
      closeTimeoutRef.current = setTimeout(() => setIsDrawerOpen(false), 200);
    }
  }, []);

  const nextSurahSlugRef = useRef(nextSurahSlug);
  const routerRef = useRef(router);

  useEffect(() => {
    nextSurahSlugRef.current = nextSurahSlug;
  }, [nextSurahSlug]);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);



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
        artist: 'WITRQURAN',
        album: `Surah ${surah.id}`,
        artwork: [
          { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
          { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      });
      navigator.mediaSession.setActionHandler('play', () => {
        audio.play().catch(console.error);
      });
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('seekbackward', () => { audio.currentTime = Math.max(0, audio.currentTime - 15); });
      navigator.mediaSession.setActionHandler('seekforward', () => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15); });
      
      if (prevSurahSlug) {
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          routerRef.current.push(`/surah/${prevSurahSlug}`);
        });
      } else {
        navigator.mediaSession.setActionHandler('previoustrack', null);
      }

      if (nextSurahSlug) {
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          routerRef.current.push(`/surah/${nextSurahSlug}`);
        });
      } else {
        navigator.mediaSession.setActionHandler('nexttrack', null);
      }
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

  // Bottom Sheet Swipe to Close
  const [sheetTouchStart, setSheetTouchStart] = useState<number | null>(null);
  const [sheetTouchEnd, setSheetTouchEnd] = useState<number | null>(null);
  
  const onSheetTouchStart = (e: React.TouchEvent) => {
    setSheetTouchEnd(null);
    setSheetTouchStart(e.targetTouches[0].clientY);
  };
  
  const onSheetTouchMove = (e: React.TouchEvent) => {
    setSheetTouchEnd(e.targetTouches[0].clientY);
  };
  
  const onSheetTouchEnd = () => {
    if (!sheetTouchStart || !sheetTouchEnd) return;
    const distance = sheetTouchEnd - sheetTouchStart;
    if (distance > 50) {
      setIsSheetOpen(false);
    }
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
        if (audioRef.current && isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
          setIsBuffering(false);
          setErrorMsg("Audio playback error. Please try again.");
        }
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

      {/* Main Content (Grid Engine) */}
      <div className={styles.playerContent}>
        
        {/* Mobile Top Bar */}
        <div className={styles.mobileTopBar}>
          <button 
            className={styles.iconBtn} 
            onClick={() => router.back()}
            aria-label="Go Back"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            className={styles.iconBtn}
            aria-label="Add to Favorites"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4.318 6.318C3.896 6.74 3.561 7.241 3.333 7.793C3.105 8.345 2.988 8.94 2.988 9.542C2.988 10.144 3.105 10.739 3.333 11.291C3.561 11.843 3.896 12.344 4.318 12.766L12 20.448L19.682 12.766C20.536 11.912 21.015 10.754 21.015 9.542C21.015 8.33 20.536 7.172 19.682 6.318C18.828 5.464 17.67 4.985 16.458 4.985C15.246 4.985 14.088 5.464 13.234 6.318L12 7.552L10.766 6.318C10.344 5.896 9.843 5.561 9.291 5.333C8.739 5.105 8.144 4.988 7.542 4.988C6.94 4.988 6.345 5.105 5.793 5.333C5.241 5.561 4.74 5.896 4.318 6.318V6.318Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Mobile Dynamic Premium Artwork */}
        {(() => {
          const { color1, color2, colorGlow, colorGold, compType, pos1X, pos1Y, pos2X, pos2Y } = getPremiumArtwork(surah.id);
          return (
            <div className={styles.mobileArtwork} style={{ backgroundColor: color1 }}>
              {/* Mesh Gradient Lighting */}
              <div 
                className={styles.artworkMesh} 
                style={{ 
                  backgroundImage: `
                    radial-gradient(circle at ${pos1X}% ${pos1Y}%, ${colorGlow} 0%, transparent 60%),
                    radial-gradient(circle at ${pos2X}% ${pos2Y}%, ${color2} 0%, transparent 70%)
                  `
                }}
              />
              
              {/* SVG Texture & Premium Geometry */}
              <div className={styles.artworkPatternOverlay}>
                <svg width="100%" height="100%" viewBox="0 0 320 320" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="noise">
                      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
                      <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.05 0"/>
                    </filter>
                  </defs>
                  
                  {/* Generative Abstract Geometry */}
                  {compType === 0 && (
                    <g opacity="0.4" stroke={colorGold} strokeWidth="1" fill="none">
                      <circle cx="160" cy="160" r="100" />
                      <circle cx="160" cy="140" r="100" strokeDasharray="4 4" />
                      <circle cx="160" cy="160" r="140" stroke="rgba(255,255,255,0.05)" />
                    </g>
                  )}
                  {compType === 1 && (
                    <g opacity="0.3" stroke="rgba(255,255,255,0.6)" strokeWidth="0.75" fill="none">
                      <rect x="90" y="90" width="140" height="140" transform="rotate(45 160 160)" />
                      <rect x="90" y="90" width="140" height="140" />
                      <circle cx="160" cy="160" r="115" stroke={colorGold} strokeWidth="0.5" />
                    </g>
                  )}
                  {compType === 2 && (
                    <g opacity="0.4" stroke={colorGold} strokeWidth="1" fill="none">
                      <path d="M 100 320 L 100 160 A 60 60 0 0 1 220 160 L 220 320" />
                      <path d="M 80 320 L 80 160 A 80 80 0 0 1 240 160 L 240 320" stroke="rgba(255,255,255,0.1)" />
                      <circle cx="160" cy="160" r="4" fill={colorGold} opacity="0.8" />
                    </g>
                  )}
                  {compType === 3 && (
                    <g opacity="0.3" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none">
                      <path d="M -40 160 C 80 60, 240 260, 360 160" stroke={colorGold} />
                      <path d="M -40 180 C 80 80, 240 280, 360 180" />
                      <path d="M -40 200 C 80 100, 240 300, 360 200" />
                    </g>
                  )}
                  
                  {/* Film Grain Texture layer */}
                  <rect width="100%" height="100%" filter="url(#noise)" opacity="0.9" style={{ pointerEvents: 'none' }} />
                </svg>
              </div>

              {/* Artwork Text Content */}
              <div className={styles.artworkContent}>
                <div className={styles.artworkTitle}>{surah.transliteration}</div>
                <div className={styles.artworkSubtitle}>SURAH {surah.id}</div>
              </div>
            </div>
          );
        })()}

        {/* Grid Area: Titles */}
        <div className={styles.titleArea}>
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
        </div>



        {/* Grid Area: Progress */}
        <div className={styles.progressArea}>
          <div className={styles.progressSection}>
            <span className={styles.timeText}>{formatTime(currentTime)}</span>
            <div className={styles.progressBarWrapper} onClick={handleSeek}>
              <div className={styles.progressBuffer} style={{ width: `${(buffered / duration) * 100 || 0}%` }}></div>
              <div className={styles.progressFill} style={{ width: `${(currentTime / duration) * 100 || 0}%` }}></div>
            </div>
            <span className={styles.timeText}>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Grid Area: Controls */}
        <div className={styles.controlsArea}>
          <div className={styles.controlsRow}>
          {/* Speed */}
          <button className={`${styles.controlBtn} ${styles.desktopControl}`} onClick={cycleSpeed} aria-label="Playback Speed">
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
          <button className={`${styles.controlBtn} ${styles.desktopControl}`} onClick={toggleLoop} style={{ color: isLooping ? '#D4AF37' : '' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 1L21 5L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 23L3 19L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.controlLabel}>Repeat</span>
          </button>

          {/* Sleep Timer */}
          <button className={`${styles.controlBtn} ${styles.desktopControl}`} onClick={cycleTimer} style={{ color: sleepTimer ? '#D4AF37' : '' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.controlLabel}>{sleepTimer ? `${sleepTimer}m` : 'Timer'}</span>
          </button>

          {/* More Menu (Mobile Only) */}
          <button className={`${styles.controlBtn} ${styles.mobileMoreBtn}`} onClick={() => setIsSheetOpen(true)} aria-label="More Options">
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </div>
          </button>

          </div>
        </div>

        {/* Grid Area: Branding */}
        <div className={styles.brandArea}>
          <div className={styles.branding}>
          <button 
            className={styles.hamburgerBtn} 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            onMouseEnter={handleEdgeEnter}
            onMouseLeave={handleEdgeLeave}
            aria-label="Open Surah Menu"
            title="All Surahs"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '8px' }}>
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          WITRQURAN
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          </div>
        </div>
      </div>
      <SurahDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onMouseEnter={handleDrawerEnter}
        onMouseLeave={handleDrawerLeave}
      />

      {/* Mobile Action Sheet */}
      <div 
        className={`${styles.bottomSheetOverlay} ${isSheetOpen ? styles.open : ''}`} 
        onClick={() => setIsSheetOpen(false)}
      >
        <div 
          className={styles.bottomSheet} 
          onClick={e => e.stopPropagation()}
          onTouchStart={onSheetTouchStart}
          onTouchMove={onSheetTouchMove}
          onTouchEnd={onSheetTouchEnd}
        >
          <div className={styles.sheetHandle}></div>
          <div className={styles.sheetHeader}>Playback Options</div>
          
          <div className={styles.sheetRow} onClick={toggleLoop}>
            <div className={styles.sheetRowLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 1L21 5L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 11V9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 23L3 19L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 13V15C21 16.0609 20.5786 17.0783 19.8284 17.8284C19.0783 18.5786 18.0609 19 17 19H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Repeat</span>
            </div>
            <div className={styles.sheetRowRight}>
              <span>{isLooping ? 'On' : 'Off'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className={styles.sheetRow} onClick={cycleSpeed}>
            <div className={styles.sheetRowLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Playback Speed</span>
            </div>
            <div className={styles.sheetRowRight}>
              <span>{playbackRate}x</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className={styles.sheetRow} onClick={cycleTimer}>
            <div className={styles.sheetRowLeft}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Sleep Timer</span>
            </div>
            <div className={styles.sheetRowRight}>
              <span>{sleepTimer ? `${sleepTimer}m` : 'Off'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
