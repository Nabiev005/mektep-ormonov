import { useEffect, useState } from 'react';
import styles from './GeoGame.module.css';
import mapImg from '../../assets/kyrgyzstan-map.png';
import { auth } from '../../firebase';
import { addStudentXP } from '../../utils/studentAccount';
import { playCorrectSound, playWrongSound } from '../../utils/sounds';
import GameLeaderboard from '../../components/GameLeaderboard/GameLeaderboard';

const TOTAL_ROUNDS = 7;

const regions = [
  { id: 'batken', name: 'Баткен облусу', top: '75%', left: '12%' },
  { id: 'osh', name: 'Ош облусу', top: '72%', left: '32%' },
  { id: 'jalalabad', name: 'Жалал-Абад облусу', top: '48%', left: '28%' },
  { id: 'talas', name: 'Талас облусу', top: '30%', left: '18%' },
  { id: 'chuy', name: 'Чүй облусу', top: '25%', left: '42%' },
  { id: 'naryn', name: 'Нарын облусу', top: '55%', left: '55%' },
  { id: 'issyk-kul', name: 'Ысык-Көл облусу', top: '38%', left: '80%' },
];

const GeoGame = () => {
  // eslint-disable-next-line react-hooks/purity
  const [target, setTarget] = useState(regions[Math.floor(Math.random() * regions.length)]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  // eslint-disable-next-line react-hooks/purity
  const pickNewTarget = () => regions[Math.floor(Math.random() * regions.length)];

  const resetGame = () => {
    setTarget(pickNewTarget());
    setScore(0);
    setRound(1);
    setClickedId(null);
    setIsFinished(false);
    setXpAwarded(false);
  };

  const handleRegionClick = (id: string) => {
    if (isFinished) return;
    setClickedId(id);
    if (id === target.id) {
      setScore(score + 10);
      playCorrectSound();
      setTimeout(() => {
        if (round >= TOTAL_ROUNDS) {
          setIsFinished(true);
        } else {
          setRound((r) => r + 1);
          setTarget(pickNewTarget());
        }
        setClickedId(null);
      }, 1500);
    } else {
      playWrongSound();
      setTimeout(() => setClickedId(null), 800);
    }
  };

  useEffect(() => {
    if (!isFinished || xpAwarded || score === 0) return;
    const user = auth.currentUser;
    if (user) {
      addStudentXP(user, score, 'geo_game').catch(() => undefined);
    }
    setXpAwarded(true);
  }, [isFinished, xpAwarded, score]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>🌍 Geo Master</h2>
        <div className={styles.stats}>Упай: {score} · Раунд {Math.min(round, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}</div>

        {isFinished ? (
          <div className={styles.finishBox}>
            <h3>🏆 Оюн бүттү!</h3>
            <p>Жыйынтык упай: {score}</p>
            <button className={styles.restartBtn} onClick={resetGame}>Кайра баштоо</button>
            <GameLeaderboard />
          </div>
        ) : (
          <>
            <p className={styles.quest}>Тап: <strong>{target.name}</strong></p>

            <div className={styles.mapContainer}>
              <img src={mapImg} alt="Карта" className={styles.mapBackground} />

              {regions.map((reg) => (
                <button
                  key={reg.id}
                  className={`
                    ${styles.regionPoint}
                    ${clickedId === reg.id && reg.id === target.id ? styles.correct : ''}
                    ${clickedId === reg.id && reg.id !== target.id ? styles.wrong : ''}
                  `}
                  style={{ top: reg.top, left: reg.left }}
                  onClick={() => handleRegionClick(reg.id)}
                >
                  <span className={styles.ripple}></span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GeoGame;