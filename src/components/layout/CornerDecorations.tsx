import styles from './CornerDecorations.module.css';

export default function CornerDecorations({ position = 'all' }: { position?: 'top' | 'bottom' | 'all' }) {
  return (
    <>
      {(position === 'all' || position === 'top') && (
        <>
          <div className={`${styles.corner} ${styles.topLeft}`}>
            <img src="/floral-corner.png" alt="" className={styles.floralImg} />
          </div>
          
          <div className={`${styles.corner} ${styles.topRight}`}>
            <img src="/floral-corner.png" alt="" className={`${styles.floralImg} ${styles.flipped}`} />
          </div>
        </>
      )}
      
      {(position === 'all' || position === 'bottom') && (
        <>
          <div className={`${styles.corner} ${styles.bottomLeft}`}>
            <img src="/floral-corner.png" alt="" className={`${styles.floralImg} ${styles.flippedY}`} />
          </div>
          
          <div className={`${styles.corner} ${styles.bottomRight}`}>
            <img src="/floral-corner.png" alt="" className={`${styles.floralImg} ${styles.flippedXY}`} />
          </div>
        </>
      )}
    </>
  );
}
