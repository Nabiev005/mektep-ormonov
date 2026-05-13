import React, { useMemo, useEffect, useState } from 'react';
import { db } from '../../firebase';
import * as firestore from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence кошулду
import styles from './News.module.css';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageUrls?: string[];
  date: string;
  category?: string;
}

const categories = [
  { id: 'all', label: 'Баары' },
  { id: 'achievements', label: 'Жетишкендиктер' },
  { id: 'meetings', label: 'Чогулуштар' },
  { id: 'sports', label: 'Спорт' },
];

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // МОДАЛ ҮЧҮН ШТАТТАР
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const getNewsImages = (item: NewsItem) => {
    if (Array.isArray(item.imageUrls) && item.imageUrls.length > 0) return item.imageUrls.slice(0, 5);
    return item.imageUrl ? [item.imageUrl] : [];
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = firestore.query(firestore.collection(db, "news"), firestore.orderBy("createdAt", "desc"));
        const querySnapshot = await firestore.getDocs(q);
        
        const newsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as NewsItem[];

        setNews(newsData);
      } catch (error) {
        console.error("Маалыматты алууда ката кетти:", error);
        setError('Жаңылыктарды жүктөөдө ката кетти. Кийин кайра аракет кылыңыз.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = useMemo(() => {
    if (activeCategory === 'all') return news;
    return news.filter((item) => item.category === activeCategory);
  }, [activeCategory, news]);

  if (loading) return <div className={styles.loader}>Жүктөлүүдө...</div>;

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Мектеп жашоосу</span>
        <h1 className={styles.title}>Мектеп жаңылыктары</h1>
        <p className={styles.subtitle}>
          Окуучулардын ийгиликтери, иш-чаралар жана мектептеги акыркы маалыматтар.
        </p>
      </section>

      <div className={styles.tabsContainer}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={activeCategory === category.id ? styles.activeTab : styles.tab}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.newsGrid}>
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.card}
            >
              <div className={styles.imageWrap}>
                {getNewsImages(item)[0] ? (
                  <img src={getNewsImages(item)[0]} alt={item.title} className={styles.image} />
                ) : (
                  <div className={styles.imageFallback}>Жаңылык</div>
                )}
                {getNewsImages(item).length > 1 && (
                  <span className={styles.imageCount}>📷 {getNewsImages(item).length}</span>
                )}
              </div>
              <div className={styles.content}>
                <span className={styles.date}>{item.date}</span>
                <h3>{item.title}</h3>
                {/* Тексттин башын гана көрсөтөбүз */}
                <p>{item.description.length > 120 ? `${item.description.substring(0, 120)}...` : item.description}</p> 
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
          <p className={styles.noData}>Бул бөлүмдө азырынча жаңылыктар жок.</p>
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
              <div className={styles.modalGallery}>
                {getNewsImages(selectedNews).map((url, index) => (
                  <img
                    key={url}
                    src={url}
                    alt={`${selectedNews.title} ${index + 1}`}
                    className={styles.modalImg}
                  />
                ))}
              </div>
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
