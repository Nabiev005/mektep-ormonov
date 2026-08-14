import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Crown, Medal, Sparkles, Trophy } from 'lucide-react';
import { db } from '../../firebase';
import { classList } from '../../data/classList';
import styles from './Leaderboard.module.css';

interface LeaderboardEntry {
  uid: string;
  displayName?: string;
  photoURL?: string;
  className?: string;
  totalXP?: number;
}

const RANK_ICONS = [
  <Crown key="1" size={22} />,
  <Medal key="2" size={22} />,
  <Medal key="3" size={22} />,
];

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'leaderboard'), (snapshot) => {
      const data = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() })) as LeaderboardEntry[];
      setEntries(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const ranked = useMemo(() => {
    const filtered = classFilter ? entries.filter((e) => e.className === classFilter) : entries;
    return [...filtered]
      .filter((e) => (e.totalXP || 0) > 0)
      .sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0))
      .slice(0, 20);
  }, [entries, classFilter]);

  const usedClasses = useMemo(
    () => classList.filter((cls) => entries.some((e) => e.className === cls)),
    [entries]
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.badge}><Trophy size={18} /> Жалпы рейтинг</span>
        <h1>Мыкты окуучулар рейтинги</h1>
        <p>XP упайлары боюнча — оюндарда, курстарда жана тесттерде жыйналат.</p>

        <div className={styles.filterRow}>
          <button
            type="button"
            className={`${styles.filterBtn} ${!classFilter ? styles.filterBtnActive : ''}`}
            onClick={() => setClassFilter('')}
          >
            Баары
          </button>
          {usedClasses.map((cls) => (
            <button
              key={cls}
              type="button"
              className={`${styles.filterBtn} ${classFilter === cls ? styles.filterBtnActive : ''}`}
              onClick={() => setClassFilter(cls)}
            >
              {cls}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className={styles.loader}>Жүктөлүүдө...</div>
      ) : ranked.length === 0 ? (
        <div className={styles.empty}>Азырынча рейтингде эч ким жок. Оюн ойноп, биринчи болуп кириӊиз! 🎮</div>
      ) : (
        <ol className={styles.list}>
          {ranked.map((entry, index) => (
            <li key={entry.uid} className={index < 3 ? styles.topRow : styles.row}>
              <span className={styles.rank}>
                {index < 3 ? RANK_ICONS[index] : index + 1}
              </span>
              <span className={styles.avatar}>
                {entry.photoURL ? (
                  <img src={entry.photoURL} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <Sparkles size={18} />
                )}
              </span>
              <span className={styles.name}>
                {entry.displayName || 'Окуучу'}
                {entry.className && <small>{entry.className}</small>}
              </span>
              <span className={styles.xp}>{entry.totalXP || 0} XP</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;
