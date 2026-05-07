import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import AigulGulu from '../../assets/AigulGul.png';
import OrmonovPhoto from '../../assets/ormonov.png';
import styles from './Home.module.css';

const AnimatedCounter: React.FC<{ target: number; duration?: number }> = ({ target, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    const totalMilliseconds = duration * 1000;
    const incrementTime = Math.max(totalMilliseconds / end, 16);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
};

const highlights = [
  { label: 'Окуучу', value: 250, suffix: '+' },
  { label: 'Мугалим', value: 20, suffix: '+' },
  { label: 'Ийрим', value: 20, suffix: '+' },
  { label: 'ЖРТ орточо балл', value: 130, suffix: '' },
];

const directions = [
  {
    icon: '💻',
    title: 'IT жана санариптик сабактар',
    text: 'Frontend, Python, AI жана робототехника боюнча практикалык тапшырмалар.',
    path: '/community/js-game',
  },
  {
    icon: '📄',
    title: 'Мугалимдердин иш пландары',
    text: 'PDF форматындагы иш пландарды сайттан түз ачып таанышууга болот.',
    path: '/library',
  },
  {
    icon: '🏆',
    title: 'Окуучулардын ийгиликтери',
    text: 'Мыкты окуучулар, олимпиада, спорт жана мектеп жаңылыктары бир жерде.',
    path: '/best-students',
  },
];

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroShade} />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroContent}
        >
          <div className={styles.schoolBadge}>
            <img src={AigulGulu} alt="" />
            <span>Зайил Ормонов атындагы мектеп</span>
          </div>

          <h1>Терең билим, татыктуу тарбия, заманбап мүмкүнчүлүк</h1>
          <p>
            Биздин мектеп окуучуларга сапаттуу билим, санариптик көндүм жана коомго
            пайдалуу инсан болуп өсүүгө шарт түзөт.
          </p>

          <div className={styles.heroActions}>
            <Link to="/about" className={styles.primaryBtn}>Мектеп жөнүндө</Link>
            <Link to="/news" className={styles.secondaryBtn}>Жаңылыктар</Link>
          </div>

          <div className={styles.heroMeta}>
            <span>📍 Кыргыз Республикасы</span>
            <span>📚 Жалпы билим берүү мекемеси</span>
          </div>
        </motion.div>
      </section>

      <section className={styles.stats} aria-label="Мектеп көрсөткүчтөрү">
        {highlights.map((item) => (
          <div className={styles.statBox} key={item.label}>
            <h2><AnimatedCounter target={item.value} />{item.suffix}</h2>
            <p>{item.label}</p>
          </div>
        ))}
      </section>

      <section className={styles.intro}>
        <div className={styles.introText}>
          <span className={styles.eyebrow}>Мектеп порталы</span>
          <h2>Окуучу, мугалим жана ата-эне үчүн керектүү маалымат бир жерде</h2>
          <p>
            Сайт мектептин маалымат борбору катары иштейт: жаңылыктар, сабактар,
            иш пландар, мугалимдер, жетишкендиктер жана окуучулар үчүн интерактивдүү
            билим берүү оюндар жайгаштырылган.
          </p>
          <div className={styles.introLinks}>
            <Link to="/teachers">Мугалимдер</Link>
            <Link to="/schedule">Расписание</Link>
            <Link to="/contact">Байланыш</Link>
          </div>
        </div>
        <div className={styles.portraitPanel}>
          <img src={OrmonovPhoto} alt="Зайил Ормонов" />
          <div>
            <strong>Зайил Ормонов</strong>
            <span>Мектеп сыймыгы жана билим жолундагы үлгү</span>
          </div>
        </div>
      </section>

      <section className={styles.directions}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Багыттар</span>
          <h2>Мектептеги негизги мүмкүнчүлүктөр</h2>
        </div>
        <div className={styles.directionGrid}>
          {directions.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className={styles.directionCard}
            >
              <div className={styles.icon}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <Link to={item.path}>Кирүү</Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <span className={styles.eyebrow}>Байланыш</span>
          <h2>Сурооңуз барбы?</h2>
          <p>Мектеп администрациясы менен байланышып, керектүү маалыматты алыңыз.</p>
        </div>
        <Link to="/contact" className={styles.primaryBtn}>Байланышуу</Link>
      </section>
    </div>
  );
};

export default Home;
