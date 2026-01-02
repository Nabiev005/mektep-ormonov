import React from 'react';
import { motion } from 'framer-motion';
import { newsData } from '../../data/newsData';
import styles from './News.module.css';

const News: React.FC = () => {
  // Анимациянын варианттары (контейнер үчүн)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2 // Ар бир жаңылык 0.2 секунд айырма менен чыгат
      }
    }
  };

  // Ар бир карточка үчүн анимация
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className={styles.newsContainer}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.title}
      >
        Мектеп жаңылыктары
      </motion.h1>

      <motion.div 
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {newsData.map((news) => (
          <motion.div 
            key={news.id} 
            className={styles.card}
            variants={itemVariants}
            whileHover={{ y: -10 }} // Үстүнө барганда бир аз көтөрүлөт
          >
            <div className={styles.imageWrapper}>
              <img src={news.imageUrl} alt={news.title} className={styles.image} />
              <div className={styles.dateBadge}>{news.date}</div>
            </div>
            <div className={styles.content}>
              <h3 className={styles.newsTitle}>{news.title}</h3>
              <p className={styles.description}>{news.description}</p>
              <button className={styles.readMore}>Кененирээк...</button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default News;