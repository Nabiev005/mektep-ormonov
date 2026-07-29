import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Atom, Boxes, LineChart, PenTool } from 'lucide-react';
import Whiteboard from './Whiteboard';
import MathGraph from './MathGraph';
import Shapes3D from './Shapes3D';
import Physics from './Physics';
import styles from './InteractiveLab.module.css';

type TabKey = 'whiteboard' | 'graph' | 'shapes3d' | 'physics';

const TABS: { key: TabKey; label: string; icon: ReactNode; desc: string }[] = [
  {
    key: 'whiteboard',
    label: 'Интерактивдүү доска',
    icon: <PenTool size={18} />,
    desc: 'Калем же манжа менен формула, сүрөт тартыңыз',
  },
  {
    key: 'graph',
    label: 'Математикалык графиктер',
    icon: <LineChart size={18} />,
    desc: 'Функцияны жазып, графигин көрүңүз',
  },
  {
    key: 'shapes3d',
    label: '3D геометриялык фигуралар',
    icon: <Boxes size={18} />,
    desc: 'Фигураларды буруп жана кесип көрүңүз',
  },
  {
    key: 'physics',
    label: 'Физика симуляциясы',
    icon: <Atom size={18} />,
    desc: 'Маятник жана ыргытылган дене кыймылын изилдеңиз',
  },
];

const InteractiveLab = () => {
  const [tab, setTab] = useState<TabKey>('whiteboard');
  const active = TABS.find((t) => t.key === tab)!;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Интерактивдүү билим модулу</span>
        <h1>Виртуалдык математика лабораториясы</h1>
        <p>Доскага жазуу, графиктерди куруу, 3D фигураларды изилдөө жана физика симуляциялары — баары бир жерде.</p>
      </div>

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtnActive : ''}`}
            onClick={() => setTab(t.key)}
            type="button"
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <p className={styles.tabDesc}>{active.desc}</p>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={styles.panel}
      >
        {tab === 'whiteboard' && <Whiteboard />}
        {tab === 'graph' && <MathGraph />}
        {tab === 'shapes3d' && <Shapes3D />}
        {tab === 'physics' && <Physics />}
      </motion.div>
    </div>
  );
};

export default InteractiveLab;
