import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      {/* 1. HERO SECTION - Чоң сүрөт жана ураан */}
      <section className={styles.hero}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className={styles.heroContent}
        >
          <h1 className={styles.mainTitle}>Келечекти биз менен бирге куруңуз!</h1>
          <p className={styles.subtitle}>Биздин мектеп — терең билим жана татыктуу тарбия берүүчү алтын уя.</p>
          <div className={styles.heroButtons}>
            <Link to="/about" className={styles.primaryBtn}>Биз жөнүндө</Link>
            <Link to="/contact" className={styles.secondaryBtn}>Байланышуу</Link>
          </div>
        </motion.div>
      </section>

      {/* 2. STATS SECTION - Статистика */}
      <section className={styles.stats}>
        <div className={styles.statBox}>
          <h2>500+</h2>
          <p>Окуучулар</p>
        </div>
        <div className={styles.statBox}>
          <h2>40+</h2>
          <p>Мугалимдер</p>
        </div>
        <div className={styles.statBox}>
          <h2>20+</h2>
          <p>Ийримдер</p>
        </div>
        <div className={styles.statBox}>
          <h2>95%</h2>
          <p>ЖРТ орточо балл</p>
        </div>
      </section>

      {/* 3. FEATURES - Эмне үчүн биз? */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Эмне үчүн биздин мектеп?</h2>
        <div className={styles.featureGrid}>
          <motion.div whileHover={{ y: -10 }} className={styles.featureCard}>
            <div className={styles.icon}>💻</div>
            <h3>Заманбап IT класс</h3>
            <p>Эң акыркы технологиялар менен жабдылган компьютердик класстар.</p>
          </motion.div>
          <motion.div whileHover={{ y: -10 }} className={styles.featureCard}>
            <div className={styles.icon}>🏀</div>
            <h3>Спорттук комплекс</h3>
            <p>Футбол, баскетбол жана волейбол үчүн заманбап аянтчалар.</p>
          </motion.div>
          <motion.div whileHover={{ y: -10 }} className={styles.featureCard}>
            <div className={styles.icon}>📚</div>
            <h3>Бай китепкана</h3>
            <p>Миңдеген китептер жана электрондук окуу куралдары.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;