import React from 'react';
import styles from './LegalLayout.module.css';

export interface LegalSection {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections?: LegalSection[];
  children: React.ReactNode;
}

export default function LegalLayout({ title, lastUpdated, sections, children }: LegalLayoutProps) {
  return (
    <div className={styles.layoutContainer} id="top">
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.lastUpdated}>Last Updated: {lastUpdated}</p>
      
      <div className={styles.contentCard}>
        {sections && sections.length > 0 && (
          <div className={styles.tocContainer}>
            <h2 className={styles.tocTitle}>Table of Contents</h2>
            <ul className={styles.tocList}>
              {sections.map((sec) => (
                <li key={sec.id}>
                  <a href={`#${sec.id}`} className={styles.tocLink}>
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.content}>
          {children}
        </div>

        <div className={styles.backToTopContainer}>
          <a href="#top" className={styles.backToTop}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Top
          </a>
        </div>
      </div>
    </div>
  );
}
