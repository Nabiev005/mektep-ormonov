import { useState } from 'react';
import PendulumSim from './PendulumSim';
import ProjectileSim from './ProjectileSim';
import styles from './Physics.module.css';

type Mode = 'pendulum' | 'projectile';

const Physics = () => {
  const [mode, setMode] = useState<Mode>('pendulum');

  return (
    <div className={styles.wrapper}>
      <div className={styles.modeTabs}>
        <button
          className={`${styles.modeBtn} ${mode === 'pendulum' ? styles.modeBtnActive : ''}`}
          onClick={() => setMode('pendulum')}
          type="button"
        >
          🕰️ Маятник
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'projectile' ? styles.modeBtnActive : ''}`}
          onClick={() => setMode('projectile')}
          type="button"
        >
          🎯 Ыргытылган дене
        </button>
      </div>
      {mode === 'pendulum' ? <PendulumSim /> : <ProjectileSim />}
    </div>
  );
};

export default Physics;
