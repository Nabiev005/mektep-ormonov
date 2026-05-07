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
  pdfUrl?: string;
  date: string;
}

const Library: React.FC = () => {
  const [plans, setPlans] = useState<WorkPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Мурдагы маалыматтар бузулбашы үчүн коллекциянын аты library бойдон калды.
    const q = query(collection(db, 'library'), orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plansData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WorkPlan[];
      setPlans(plansData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Издөө логикасы
  const filteredPlans = plans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.heroSection}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          📄 Мугалимдердин иш планы
        </motion.h1>
        <p>Мектептеги мугалимдердин иш пландары PDF форматында жарыяланып турат.</p>
        
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
                  <div className={styles.imageWrapper}>
                    {plan.imageUrl ? (
                      <img src={plan.imageUrl} alt={plan.title} />
                    ) : (
                      <div className={styles.pdfFallback}>PDF</div>
                    )}
                  </div>
                  <div className={styles.bookInfo}>
                    <h3>{plan.title}</h3>
                    <p className={styles.description}>{plan.description}</p>
                    <div className={styles.bookFooter}>
                      <span className={styles.date}>📅 {plan.date}</span>
                      {plan.pdfUrl ? (
                        <a
                          className={styles.readBtn}
                          href={plan.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Иш планы менен таанышуу
                        </a>
                      ) : (
                        <button className={styles.disabledBtn} disabled>PDF жок</button>
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
    </div>
  );
};

export default Library;
