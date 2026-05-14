import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Library.module.css';

interface WorkPlan {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageUrls?: string[];
  date: string;
}

const Library: React.FC = () => {
  const [plans, setPlans] = useState<WorkPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<WorkPlan | null>(null);

  useEffect(() => {
    // Мурдагы маалыматтар бузулбашы үчүн коллекциянын аты library бойдон калды.
    const q = query(collection(db, 'library'), orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const plansData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WorkPlan[];
        setPlans(plansData);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Иш пландарды жүктөөдө ката кетти. Интернетти текшерип, кайра аракет кылыңыз.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Издөө логикасы
  const filteredPlans = plans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlanImages = (plan?: WorkPlan | null) => {
    if (!plan) return [];
    if (Array.isArray(plan.imageUrls) && plan.imageUrls.length > 0) return plan.imageUrls.slice(0, 5);
    return plan.imageUrl ? [plan.imageUrl] : [];
  };

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.heroSection}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          📄 Мугалимдердин иш планы
        </motion.h1>
        <p>Мектептеги мугалимдердин иш пландары сүрөт форматында жарыяланып турат.</p>
        
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Мугалимдин аты же иш планы боюнча издеңиз..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {loading ? (
        <div className={styles.loader}>Жүктөлүүдө...</div>
      ) : error ? (
        <p className={styles.noResults}>{error}</p>
      ) : (
        <motion.div 
          layout
          className={styles.booksGrid}
        >
          <AnimatePresence>
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <motion.div 
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={styles.bookCard}
                >
                  <button
                    type="button"
                    className={styles.imageWrapper}
                    onClick={() => getPlanImages(plan).length > 0 && setSelectedPlan(plan)}
                  >
                    {getPlanImages(plan)[0] ? (
                      <>
                        <img src={getPlanImages(plan)[0]} alt={plan.title} />
                        {getPlanImages(plan).length > 1 && (
                          <span className={styles.imageCount}>📷 {getPlanImages(plan).length}</span>
                        )}
                      </>
                    ) : (
                      <div className={styles.imageFallback}>Сүрөт</div>
                    )}
                  </button>
                  <div className={styles.bookInfo}>
                    <div className={styles.planBadge}>Сүрөт иш план</div>
                    <h3>{plan.title}</h3>
                    <p className={styles.description}>{plan.description}</p>
                    <div className={styles.bookFooter}>
                      <span className={styles.date}>📅 {plan.date}</span>
                      {getPlanImages(plan).length > 0 ? (
                        <button className={styles.readBtn} onClick={() => setSelectedPlan(plan)}>
                          Чоң ачуу
                        </button>
                      ) : (
                        <button className={styles.disabledBtn} disabled>Сүрөт жок</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className={styles.noResults}>Тилекке каршы, эч нерсе табылган жок 😕</p>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedPlan && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPlan(null)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2>{selectedPlan.title}</h2>
                <button onClick={() => setSelectedPlan(null)}>Жабуу</button>
              </div>
              <div className={styles.modalImages}>
                {getPlanImages(selectedPlan).map((url, index) => (
                  <figure key={url}>
                    <img src={url} alt={`${selectedPlan.title} ${index + 1}`} />
                    {getPlanImages(selectedPlan).length > 1 && (
                      <figcaption>{index + 1} / {getPlanImages(selectedPlan).length}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Library;
