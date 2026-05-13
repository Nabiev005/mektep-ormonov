import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Camera, Images, Search, Sparkles, X } from 'lucide-react';
import styles from './Gallery.module.css';

interface ImageItem {
  id: string;
  title: string;
  imageUrl: string;
  date?: string;
  description?: string;
}

const Gallery = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImg, setSelectedImg] = useState<ImageItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ImageItem[];
      setImages(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredImages = images.filter((item) => {
    const search = `${item.title} ${item.date || ''} ${item.description || ''}`.toLowerCase();
    return search.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className={styles.galleryPage}>
        <div className={styles.loader}>
          <span className={styles.spinner}></span>
          Галерея жүктөлүүдө...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.galleryPage}>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.headerArea}
      >
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>
            <Camera size={18} />
            Фото архив
          </span>
          <h1>Мектеп жашоосу</h1>
          <p>Биздин мектептеги кызыктуу көз ирмемдер, иш-чаралар жана эстелик сүрөттөр.</p>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <Images size={23} />
            <strong>{images.length}</strong>
            <span>сүрөт</span>
          </div>
          <div className={styles.statCard}>
            <Sparkles size={23} />
            <strong>LIVE</strong>
            <span>жаңыланып турат</span>
          </div>
        </div>
      </motion.section>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={19} />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Сүрөттү аталышы же датасы боюнча издөө..."
          />
        </div>
        <span className={styles.resultCount}>{filteredImages.length} сүрөт</span>
      </div>

      <div className={styles.imageGrid}>
        {filteredImages.length > 0 ? (
          filteredImages.map((item, index) => (
            <motion.button
              layout
              key={item.id}
              className={styles.imageCard}
              onClick={() => setSelectedImg(item)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              type="button"
            >
              <div className={styles.imageFrame}>
                <img src={item.imageUrl} alt={item.title} />
              </div>
              <div className={styles.cardBody}>
                <h3>{item.title}</h3>
                <span>
                  <CalendarDays size={15} />
                  {item.date || 'Дата кошула элек'}
                </span>
              </div>
            </motion.button>
          ))
        ) : (
          <div className={styles.noData}>
            <Search size={34} />
            <h3>Сүрөт табылган жок</h3>
            <p>Издөө сөзүн өзгөртүп көрүңүз же админ панелден жаңы сүрөт кошуңуз.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={styles.lightbox} 
            onClick={() => setSelectedImg(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className={styles.lightboxContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={() => setSelectedImg(null)} type="button" aria-label="Жабуу">
                <X size={24} />
              </button>
              <img src={selectedImg.imageUrl} alt={selectedImg.title} />
              <div className={styles.lightboxInfo}>
                <h2>{selectedImg.title}</h2>
                <span>
                  <CalendarDays size={16} />
                  {selectedImg.date || 'Дата кошула элек'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
