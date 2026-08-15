import { useEffect, useState } from 'react';
import styles from './GeoGame.module.css';
import mapImg from '../../assets/kyrgyzstan-map.png';
import { Globe2, MapPin, Trophy } from 'lucide-react';
import { auth } from '../../firebase';
import { addStudentXP } from '../../utils/studentAccount';
import { playCorrectSound, playWrongSound } from '../../utils/sounds';
import GameLeaderboard from '../../components/GameLeaderboard/GameLeaderboard';

const TOTAL_ROUNDS = 7;

// Толук дүйнө картасы (NASA Blue Marble, -180..180 / -90..90 so чекитти
// координата боюнча эсептеп коюуга болот): x% = (lon+180)/360*100, y% = (90-lat)/180*100
const WORLD_MAP_URL = 'https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg';

interface GeoPoint {
  id: string;
  name: string;
  top: string;
  left: string;
}

const kyrgyzstanRegions: GeoPoint[] = [
  { id: 'batken', name: 'Баткен облусу', top: '75%', left: '12%' },
  { id: 'osh', name: 'Ош облусу', top: '72%', left: '32%' },
  { id: 'jalalabad', name: 'Жалал-Абад облусу', top: '48%', left: '28%' },
  { id: 'talas', name: 'Талас облусу', top: '30%', left: '18%' },
  { id: 'chuy', name: 'Чүй облусу', top: '25%', left: '42%' },
  { id: 'naryn', name: 'Нарын облусу', top: '55%', left: '55%' },
  { id: 'issyk-kul', name: 'Ысык-Көл облусу', top: '38%', left: '80%' },
];

// Ар бир мамлекеттин борбор шаарынын координатасы боюнча эсептелген
const worldCountries: GeoPoint[] = [
  { id: 'kg', name: 'Кыргызстан', top: '26.2%', left: '70.7%' },
  { id: 'ru', name: 'Россия', top: '19.0%', left: '60.5%' },
  { id: 'cn', name: 'Кытай', top: '27.8%', left: '82.3%' },
  { id: 'us', name: 'АКШ', top: '28.4%', left: '28.6%' },
  { id: 'tr', name: 'Түркия', top: '27.8%', left: '59.1%' },
  { id: 'kz', name: 'Казакстан', top: '21.6%', left: '69.9%' },
  { id: 'uz', name: 'Өзбекстан', top: '27.1%', left: '69.2%' },
  { id: 'de', name: 'Германия', top: '20.8%', left: '53.7%' },
  { id: 'fr', name: 'Франция', top: '22.9%', left: '50.7%' },
  { id: 'gb', name: 'Улуу Британия', top: '21.4%', left: '50.0%' },
  { id: 'jp', name: 'Япония', top: '30.2%', left: '88.8%' },
  { id: 'eg', name: 'Египет', top: '33.3%', left: '58.7%' },
  { id: 'br', name: 'Бразилия', top: '58.8%', left: '36.7%' },
  { id: 'in', name: 'Индия', top: '34.1%', left: '71.5%' },
];

type MapMode = 'kyrgyzstan' | 'world';

const GeoGame = () => {
  const [mode, setMode] = useState<MapMode>('kyrgyzstan');
  const points = mode === 'kyrgyzstan' ? kyrgyzstanRegions : worldCountries;
  const mapUrl = mode === 'kyrgyzstan' ? mapImg : WORLD_MAP_URL;
  const totalRounds = Math.min(TOTAL_ROUNDS, points.length);

  const pickNewTarget = (list: GeoPoint[]) => list[Math.floor(Math.random() * list.length)];

  const [target, setTarget] = useState<GeoPoint>(() => pickNewTarget(kyrgyzstanRegions));
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  const resetGame = (nextMode: MapMode = mode) => {
    const list = nextMode === 'kyrgyzstan' ? kyrgyzstanRegions : worldCountries;
    setMode(nextMode);
    setTarget(pickNewTarget(list));
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
        if (round >= totalRounds) {
          setIsFinished(true);
        } else {
          setRound((r) => r + 1);
          setTarget(pickNewTarget(points));
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setXpAwarded(true);
  }, [isFinished, xpAwarded, score]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}><Globe2 size={26} style={{ verticalAlign: 'middle', marginRight: 8 }} /> Geo Master</h2>

        <div className={styles.modeSwitch}>
          <button
            className={mode === 'kyrgyzstan' ? styles.modeBtnActive : styles.modeBtn}
            onClick={() => resetGame('kyrgyzstan')}
          >
            <MapPin size={15} /> Кыргызстан
          </button>
          <button
            className={mode === 'world' ? styles.modeBtnActive : styles.modeBtn}
            onClick={() => resetGame('world')}
          >
            <Globe2 size={15} /> Дүйнө
          </button>
        </div>

        <div className={styles.stats}>Упай: {score} · Раунд {Math.min(round, totalRounds)}/{totalRounds}</div>

        {isFinished ? (
          <div className={styles.finishBox}>
            <Trophy size={32} color="#60a5fa" />
            <h3>Оюн бүттү!</h3>
            <p>Жыйынтык упай: {score}</p>
            <button className={styles.restartBtn} onClick={() => resetGame()}>Кайра баштоо</button>
            <GameLeaderboard />
          </div>
        ) : (
          <>
            <p className={styles.quest}>Тап: <strong>{target.name}</strong></p>

            <div className={styles.mapContainer}>
              <img src={mapUrl} alt="Карта" className={styles.mapBackground} />

              {points.map((point) => (
                <button
                  key={point.id}
                  className={`
                    ${styles.regionPoint}
                    ${clickedId === point.id && point.id === target.id ? styles.correct : ''}
                    ${clickedId === point.id && point.id !== target.id ? styles.wrong : ''}
                  `}
                  style={{ top: point.top, left: point.left }}
                  onClick={() => handleRegionClick(point.id)}
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
