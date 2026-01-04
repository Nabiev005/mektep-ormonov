import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import * as firestore from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence кошулду
import styles from './News.module.css';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // МОДАЛ ҮЧҮН ШТАТТАР
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = firestore.query(firestore.collection(db, "news"), firestore.orderBy("date", "desc"));
        const querySnapshot = await firestore.getDocs(q);
        
        const newsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as NewsItem[];

        setNews(newsData);
      } catch (error) {
        console.error("Маалыматты алууда ката кетти:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className={styles.loader}>Жүктөлүүдө...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мектеп жаңылыктары</h1>
      <div className={styles.newsGrid}>
        {news.length > 0 ? (
          news.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.card}
            >
              <img src={item.imageUrl} alt={item.title} className={styles.image} />
              <div className={styles.content}>
                <span className={styles.date}>{item.date}</span>
                <h3>{item.title}</h3>
                {/* Тексттин башын гана көрсөтөбүз */}
                <p>{item.description.substring(0, 100)}...</p> 
                <button 
                  className={styles.moreBtn} 
                  onClick={() => setSelectedNews(item)}
                >
                  Толук маалымат 👁️
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p>Азырынча жаңылыктар жок.</p>
        )}
      </div>

      {/* --- МОДАЛДЫК ТЕРЕЗЕ --- */}
      <AnimatePresence>
        {selectedNews && (
          <div className={styles.modalOverlay} onClick={() => setSelectedNews(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={() => setSelectedNews(null)}>&times;</button>
              <img src={selectedNews.imageUrl} alt={selectedNews.title} className={styles.modalImg} />
              <div className={styles.modalBody}>
                <span className={styles.modalDate}>📅 {selectedNews.date}</span>
                <h2>{selectedNews.title}</h2>
                <div className={styles.modalFullDesc}>
                  {selectedNews.description}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;