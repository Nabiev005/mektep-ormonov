import { useState, useEffect } from 'react';
import { db } from '../../firebase'; // Импортту текшерип коюңуз
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Gallery.module.css';

// 1. Маалыматтын түрүн аныктайбыз (Interface)
interface ImageItem {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
}

const Gallery = () => {
  // 2. Штатка типти беребиз: ImageItem[] (массив экенин билдирет)
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImg, setSelectedImg] = useState<ImageItem | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // 3. Маалыматты тизмеге алганда "as ImageItem" деп типти тактайбыз
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ImageItem[];
      setImages(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.galleryPage}>
      <div className={styles.headerArea}>
        <h1>📸 Мектеп жашоосу</h1>
        <p>Биздин мектептеги кызыктуу көз ирмемдер</p>
      </div>

      <div className={styles.imageGrid}>
        {images.map((item) => (
          <motion.div 
            layout
            key={item.id} // Эми TypeScript "id жок" деп айтпайт
            className={styles.imageCard}
            onClick={() => setSelectedImg(item)}
            whileHover={{ scale: 1.02 }}
          >
            <img src={item.imageUrl} alt={item.title} />
            <div className={styles.overlay}>
              <span>{item.title}</span>
              <small>{item.date}</small>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={styles.lightbox} 
            onClick={() => setSelectedImg(null)}
          >
            <motion.img 
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              src={selectedImg.imageUrl} alt="Zoomed" 
            />
            <button className={styles.closeBtn}>&times;</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;