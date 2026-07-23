'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';
import logoImg from '../../../public/logo.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isPlayerPage = pathname?.startsWith('/surah/');

  return (
    <footer className={`${styles.footer} ${isPlayerPage ? styles.hiddenOnMobilePlayer : ''}`}>
      <div className={`container ${styles.footerContent}`}>
        
        {/* Section 1: Brand */}
        <div className={styles.brandSection}>
          <div className={styles.logo}>
            <Link href="/">
              <Image 
                src={logoImg} 
                alt="WITRQURAN" 
                className={styles.logoImage}
              />
            </Link>
          </div>
          <p className={styles.description}>
            A simple and peaceful way to listen to the Holy Quran online.
          </p>
          <p className={styles.description}>
            100% Free forever.<br />
            No registration required.
          </p>
        </div>

        {/* Section 2: Navigation */}
        <div className={styles.linksSection}>
          <h4 className={styles.linkTitle}>Navigation</h4>
          <div className={styles.linkGroup}>
            <Link href="/" className={styles.link}>Home</Link>
            <Link href="/surahs" className={styles.link}>Surahs</Link>
            <Link href="/about" className={styles.link}>About WITRQURAN</Link>
          </div>
        </div>

        {/* Section 3: Legal */}
        <div className={styles.linksSection}>
          <h4 className={styles.linkTitle}>Legal</h4>
          <div className={styles.linkGroup}>
            <Link href="/privacy-policy" className={styles.link}>Privacy Policy</Link>
            <Link href="/terms-and-conditions" className={styles.link}>Terms & Conditions</Link>
            <Link href="/cookie-policy" className={styles.link}>Cookie Policy</Link>
            <Link href="/refund-policy" className={styles.link}>Refund Policy</Link>
          </div>
        </div>

        {/* Section 4: Policies */}
        <div className={styles.linksSection}>
          <h4 className={styles.linkTitle}>Compliance</h4>
          <div className={styles.linkGroup}>
            <Link href="/disclaimer" className={styles.link}>Disclaimer</Link>
            <Link href="/dmca-policy" className={styles.link}>DMCA Policy</Link>
            <Link href="/copyright-policy" className={styles.link}>Copyright Policy</Link>
          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomContent}`}>
          <p className={styles.copyright}>© 2026 WITRQURAN. All Rights Reserved.</p>
          <p className={styles.bottomText}>
            Built to help Muslims around the world listen to the Holy Quran online for free.
          </p>
        </div>
      </div>
    </footer>
  );
}
