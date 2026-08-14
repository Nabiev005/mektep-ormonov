import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Trophy } from 'lucide-react';
import { db } from '../../firebase';
import styles from './GameLeaderboard.module.css';

interface LeaderboardEntry {
  uid: string;
  displayName?: string;
  totalXP?: number;
}

interface GameLeaderboardProps {
  title?: string;
  limit?: number;
}

/**
 * `leaderboard` коллекциясынан жалпы мектеп боюнча топ окуучуларды көрсөткөн кичи виджет.
 * Оюндардын аяктоо экрандарында коюу үчүн ылайыкталган.
 */
const GameLeaderboard: React.FC<GameLeaderboardProps> = ({ title = 'Мектеп боюнча топ', limit = 5 }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'leaderboard'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() })) as LeaderboardEntry[];
      data.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
      setEntries(data.slice(0, limit));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [limit]);

  return (
    <div className={styles.wrap}>
      <div className={styles.title}><Trophy size={16} /> {title}</div>
      {loading ? (
        <p className={styles.empty}>Жүктөлүүдө...</p>
      ) : entries.length === 0 ? (
        <p className={styles.empty}>Азырынча эч ким жок — биринчи болуп кириӊиз!</p>
      ) : (
        <ol className={styles.list}>
          {entries.map((entry, index) => (
            <li key={entry.uid} className={styles.row}>
              <span className={styles.rank}>{index + 1}</span>
              <span className={styles.name}>{entry.displayName || 'Окуучу'}</span>
              <span className={styles.xp}>{entry.totalXP || 0} XP</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default GameLeaderboard;
