'use client';

import React, { useEffect, useState } from 'react';
import styles from './LegalDocsLayout.module.css';

export interface LegalSection {
  id: string;
  title: string;
}

interface LegalDocsLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  readingTime: string;
  sections: LegalSection[];
  children: React.ReactNode;
}

export default function LegalDocsLayout({
  title,
  description,
  lastUpdated,
  readingTime,
  sections,
  children
}: LegalDocsLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll) * 100);

      // Determine active section
      const sectionElements = sections.map(sec => document.getElementById(sec.id));
      let currentSectionId = '';
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section is near the top of the viewport
          if (rect.top <= 150) {
            currentSectionId = sections[i].id;
            break;
          }
        }
      }
      
      if (!currentSectionId && sections.length > 0) {
        currentSectionId = sections[0].id;
      }
      
      setActiveSection(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className={styles.scrollProgressContainer}>
        <div 
          className={styles.scrollProgressBar} 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className={styles.pageWrapper}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={`container ${styles.heroContainer}`}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.description}>{description}</p>
            <div className={styles.metaData}>
              <span className={styles.badge}>Last Updated: {lastUpdated}</span>
              <span className={styles.badge}>{readingTime} Read</span>
            </div>
          </div>
        </div>

        <div className={`container ${styles.mainLayout}`}>
          {/* Sticky Sidebar Navigation (Desktop only) */}
          <aside className={styles.sidebar}>
            <nav className={styles.stickyNav}>
              <h4 className={styles.navTitle}>On this page</h4>
              <ul className={styles.navList}>
                {sections.map((section) => (
                  <li key={section.id}>
                    <a 
                      href={`#${section.id}`} 
                      className={`${styles.navLink} ${activeSection === section.id ? styles.activeNavLink : ''}`}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content Area */}
          <main className={styles.contentArea}>
            <div className={styles.content}>
              {children}
            </div>
          </main>
        </div>

        {/* Floating Scroll to Top */}
        <button 
          className={`${styles.scrollTopBtn} ${scrollProgress > 10 ? styles.visible : ''}`} 
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </>
  );
}
