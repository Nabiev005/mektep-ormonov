import { useState } from 'react';
import styles from './GeoGame.module.css';
import mapImg from '../../assets/kyrgyzstan-map.png'; 

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
  const [clickedId, setClickedId] = useState<string | null>(null);

  const handleRegionClick = (id: string) => {
    setClickedId(id);
    if (id === target.id) {
      setScore(score + 10);
      setTimeout(() => {
        setTarget(regions[Math.floor(Math.random() * regions.length)]);
        setClickedId(null);
      }, 1500);
    } else {
      setTimeout(() => setClickedId(null), 800);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>🌍 Geo Master</h2>
        <div className={styles.stats}>Упай: {score}</div>
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
      </div>
    </div>
  );
};

export default GeoGame;