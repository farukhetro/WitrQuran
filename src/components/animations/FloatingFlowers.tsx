import styles from './FloatingFlowers.module.css';

export default function FloatingFlowers() {
  return (
    <div className={styles.container} aria-hidden="true">
      <div className={`${styles.petal} ${styles.petal1}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Handcrafted delicate leaf/petal */}
          <path d="M50 0 C70 30 90 40 90 60 C90 80 70 90 50 100 C30 90 10 80 10 60 C10 40 30 30 50 0 Z" fill="var(--highlight)" opacity="0.45"/>
          <path d="M50 20 V80" stroke="var(--background)" strokeWidth="2" opacity="0.3"/>
        </svg>
      </div>
      <div className={`${styles.petal} ${styles.petal2}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0 C70 30 90 40 90 60 C90 80 70 90 50 100 C30 90 10 80 10 60 C10 40 30 30 50 0 Z" fill="var(--highlight)" opacity="0.35"/>
          <path d="M50 20 V80" stroke="var(--background)" strokeWidth="2" opacity="0.3"/>
        </svg>
      </div>
      <div className={`${styles.petal} ${styles.petal3}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Alternative intricate flower shape */}
          <path d="M50 10 C60 30 80 40 90 50 C80 60 60 70 50 90 C40 70 20 60 10 50 C20 40 40 30 50 10 Z" fill="var(--highlight)" opacity="0.5"/>
          <circle cx="50" cy="50" r="10" fill="var(--highlight-light)" opacity="0.8"/>
        </svg>
      </div>
      <div className={`${styles.petal} ${styles.petal4}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 C60 30 80 40 90 50 C80 60 60 70 50 90 C40 70 20 60 10 50 C20 40 40 30 50 10 Z" fill="var(--highlight)" opacity="0.35"/>
        </svg>
      </div>
    </div>
  );
}
