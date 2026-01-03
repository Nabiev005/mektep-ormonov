import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import * as firestore from 'firebase/firestore';
import { motion } from 'framer-motion';
import styles from './News.module.css';

// Жаңылыктын тиби
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

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Базадан "news" коллекциясын алуу
        const q = firestore.query(firestore.collection(db, "news"));
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={styles.card}
            >
              <img src={item.imageUrl} alt={item.title} className={styles.image} />
              <div className={styles.content}>
                <span className={styles.date}>{item.date}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p>Азырынча жаңылыктар жок.</p>
        )}
      </div>
    </div>
  );
};

export default News;