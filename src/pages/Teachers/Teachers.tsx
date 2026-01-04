import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion'; // AnimatePresence кошулду
import styles from './Teachers.module.css';

interface Teacher {
  id: string;
  title: string;       
  description: string; 
  imageUrl: string;    
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Тандалган мугалимди сактоо үчүн штат
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Teacher[];
        
        setTeachers(data);
      } catch (error) {
        console.error("Мугалимдерди жүктөөнү ката кетти:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  if (loading) return <div className={styles.loader}>Мугалимдер жүктөлүүдө...</div>;

  return (
    <div className={styles.container}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.pageTitle}
      >
        Биздин кадырлуу мугалимдерибиз
      </motion.h1>

      <div className={styles.teachersGrid}>
        {teachers.length > 0 ? (
          teachers.map((teacher, index) => (
            <motion.div 
              key={teacher.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={styles.teacherCard}
            >
              <div className={styles.imageBox}>
                <img src={teacher.imageUrl} alt={teacher.title} />
              </div>
              <div className={styles.infoBox}>
                <h3>{teacher.title}</h3>
                {/* Кыскача маалымат (сабагы) */}
                <p className={styles.subject}>
                  {teacher.description.length > 50 
                    ? `${teacher.description.substring(0, 50)}...` 
                    : teacher.description}
                </p>
                <button 
                  className={styles.detailBtn}
                  onClick={() => setSelectedTeacher(teacher)}
                >
                  Толук маалымат 👁️
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className={styles.noData}>Мугалимдер тууралуу маалымат табылган жок.</p>
        )}
      </div>

      {/* --- МОДАЛДЫК ТЕРЕЗЕ (Мугалимдин толук профили) --- */}
      <AnimatePresence>
        {selectedTeacher && (
          <div className={styles.modalOverlay} onClick={() => setSelectedTeacher(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={() => setSelectedTeacher(null)}>&times;</button>
              
              <div className={styles.modalBody}>
                <img src={selectedTeacher.imageUrl} alt={selectedTeacher.title} className={styles.modalImg} />
                <div className={styles.modalInfo}>
                  <h2>{selectedTeacher.title}</h2>
                  <div className={styles.fullBio}>
                    <strong>Биографиясы жана иш тажрыйбасы:</strong>
                    <p>{selectedTeacher.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teachers;