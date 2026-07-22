'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import SurahDrawer from '../navigation/SurahDrawer';
import logoImg from '../../../public/logo.png';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false); // Architecture for future pinning feature
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Close drawer when route changes (unless pinned)
  useEffect(() => {
    if (!isPinned && window.innerWidth < 1024) {
      setIsDrawerOpen(false);
    }
  }, [pathname, isPinned]);

  const handleEdgeEnter = () => {
    if (!isPinned && window.innerWidth >= 1024) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      
      openTimeoutRef.current = setTimeout(() => {
        setIsDrawerOpen(true);
      }, 150); // ~150ms delay to prevent accidental activation
    }
  };

  const handleEdgeLeave = () => {
    if (!isPinned && window.innerWidth >= 1024) {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      
      closeTimeoutRef.current = setTimeout(() => {
        setIsDrawerOpen(false);
      }, 200); // 200ms delay to allow cursor movement into the drawer
    }
  };

  const handleDrawerEnter = () => {
    if (!isPinned && window.innerWidth >= 1024) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    }
  };

  const handleDrawerLeave = () => {
    if (!isPinned && window.innerWidth >= 1024) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsDrawerOpen(false);
      }, 200);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      {/* Invisible Edge Hover Trigger for Desktop */}
      <div 
        className={styles.edgeHoverTrigger}
        onMouseEnter={handleEdgeEnter}
        onMouseLeave={handleEdgeLeave}
        aria-hidden="true"
      />
      
      <header className={styles.header}>
        <div className={`container ${styles.navbar}`}>
          <div className={styles.leftSection}>
            <button 
              className={styles.hamburgerBtn}
              onClick={toggleDrawer}
              aria-label="Toggle Surah Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className={styles.logoContainer}>
              <Link href="/">
                <div className={styles.logo}>
                  <Image 
                    src={logoImg} 
                    alt="WITRQURAN" 
                    className={styles.logoImage}
                    priority
                  />
                </div>
              </Link>
            </div>
          </div>

          <nav className={styles.navLinks}>
            <Link href="/" className={styles.link}>Home</Link>
            <Link href="/surahs" className={styles.link}>Surahs</Link>
          </nav>

          <div className={styles.actions}>
            <Link href="/surahs" className={styles.listenNow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18V5L21 3V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 19C19.6569 19 21 17.6569 21 16C21 14.3431 19.6569 13 18 13C16.3431 13 15 14.3431 15 16C15 17.6569 16.3431 19 18 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Listen Now
            </Link>
          </div>
        </div>
      </header>
      
      <SurahDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onMouseEnter={handleDrawerEnter}
        onMouseLeave={handleDrawerLeave}
      />
    </>
  );
}
