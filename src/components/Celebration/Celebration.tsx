import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Celebration.module.css';

const COLORS = ['#ff0', '#f0f', '#0ff', '#0f0', '#ffa500'];

interface CelebrationProps {
  active: boolean;
  pieces?: number;
}

/**
 * Оюн утулганда/рекорд жаралганда көрсөтүлүүчү конфетти анимациясы.
 * Алгач ApricotQuiz.tsx'те жазылган, бул жерге көп оюндарда кайра колдонуу үчүн чыгарылды.
 */
const Celebration: React.FC<CelebrationProps> = ({ active, pieces = 30 }) => (
  <AnimatePresence>
    {active && (
      <div className={styles.confettiOverlay}>
        {Array.from({ length: pieces }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${(i * 137.5) % 100}%`, opacity: 1 }}
            animate={{ y: '100vh', rotate: 720 }}
            transition={{ duration: 3, ease: 'linear' }}
            className={styles.confettiPiece}
            style={{ backgroundColor: COLORS[i % COLORS.length] }}
          />
        ))}
      </div>
    )}
  </AnimatePresence>
);

export default Celebration;
