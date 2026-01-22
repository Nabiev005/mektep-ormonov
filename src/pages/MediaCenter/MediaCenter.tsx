import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import styles from './MediaCenter.module.css';

interface MediaItem {
  id: string;
  title: string;
  author: string;
  date: string;
  mediaType: 'podcast' | 'video' | 'news';
  videoUrl?: string; 
}

const MediaCenter: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'media-center'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MediaItem[];
      setMediaItems(data);
    });
    return () => unsubscribe();
  }, []);

  const getYTId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|u\/\w\/))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const filteredItems = filter === 'all' ? mediaItems : mediaItems.filter(item => item.mediaType === filter);

  return (
    <div className={styles.container}>
      <header className={styles.headerArea}>
        <h1 className={styles.mainTitle}>Окуучулардын Медиа-борбору</h1>
        <p className={styles.subtitle}>Мектебибиздин жашоосу окуучулардын көзү менен тартылган видеолордо, подкасттарда жана макалаларда.</p>
      </header>

      <div className={styles.filterBar}>
        <button className={`${styles.fBtn} ${filter === 'all' ? styles.fActive : ''}`} onClick={() => setFilter('all')}>
          Баары
        </button>
        <button className={`${styles.fBtn} ${filter === 'podcast' ? styles.fActive : ''}`} onClick={() => setFilter('podcast')}>
          🎙️ Подкасттар
        </button>
        <button className={`${styles.fBtn} ${filter === 'video' ? styles.fActive : ''}`} onClick={() => setFilter('video')}>
          🎥 Видеолор
        </button>
        <button className={`${styles.fBtn} ${filter === 'news' ? styles.fActive : ''}`} onClick={() => setFilter('news')}>
          📰 Гезит
        </button>
      </div>

      <div className={styles.grid}>
        <AnimatePresence mode='popLayout'>
          {filteredItems.map((item) => (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.card} key={item.id}>
              <div className={styles.imgBox}>
                <img 
                  src={item.mediaType === 'video' ? `https://img.youtube.com/vi/${getYTId(item.videoUrl)}/mqdefault.jpg` : 'https://img.freepik.com/free-vector/media-player-concept-illustration_114360-3135.jpg'} 
                  alt="" 
                />
                <span className={styles.badge}>{item.mediaType.toUpperCase()}</span>
              </div>
              <div className={styles.info}>
                <h3 className={styles.title}>{item.title}</h3>
                <div className={styles.meta}>
                  <span>👤 {item.author}</span>
                  <span>📅 {item.date}</span>
                </div>
                <button 
                  onClick={() => {
                    const id = getYTId(item.videoUrl);
                    if (id) setSelectedVideo(id);
                  }} 
                  className={styles.btn}
                >
                  Көрүп чыгуу →
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.overlay} onClick={() => setSelectedVideo(null)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={() => setSelectedVideo(null)}>✕</button>
              <div className={styles.videoWrapper}>
                <iframe src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} title="Video" frameBorder="0" allowFullScreen></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaCenter;