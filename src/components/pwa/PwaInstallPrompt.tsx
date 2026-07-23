'use client';

import { useState, useEffect } from 'react';
import styles from './PwaInstallPrompt.module.css';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed
    const hasDismissed = localStorage.getItem('witrquran-pwa-dismissed');
    if (hasDismissed) return;

    // Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIPad = !!ua.match(/iPad/i);
    const isIPhone = !!ua.match(/iPhone/i);
    const isWebKit = !!ua.match(/WebKit/i);
    const isSafari = isIPad || isIPhone ? isWebKit && !ua.match(/CriOS/i) : false;

    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && (window.navigator as any).standalone);

    if (isStandalone) return;

    if (isSafari) {
      setIsIOS(true);
      setShowPrompt(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('witrquran-pwa-dismissed', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.promptCard}>
        <button className={styles.closeBtn} onClick={handleDismiss} aria-label="Dismiss">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles.iconContainer}>
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img src="/apple-touch-icon.png" alt="App Icon" className={styles.appIcon} />
        </div>
        <h3 className={styles.title}>Install WITRQURAN</h3>
        
        {isIOS ? (
          <div className={styles.iosGuide}>
            <p className={styles.description}>
              Listen to the Quran seamlessly. Add to your home screen for full-screen experience and background playback.
            </p>
            <ol className={styles.steps}>
              <li>Tap the <strong>Share</strong> icon below.</li>
              <li>Select <strong>Add to Home Screen</strong>.</li>
            </ol>
          </div>
        ) : (
          <div className={styles.androidGuide}>
            <p className={styles.description}>
              Listen to the Quran seamlessly. Install the app for full-screen experience and background playback.
            </p>
            <button className={styles.installBtn} onClick={handleInstallClick}>
              Install App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
