import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './BestStudents.module.css';

interface Student {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
}

const BestStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'best-students'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      setStudents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className={styles.loader}>Жүктөлүүдө...</div>;

  return (
    <div className={styles.container}>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className={styles.title}
      >
        🌟 Биздин мыкты окуучуларыбыз
      </motion.h1>

      <div className={styles.grid}>
        {students.map((student) => (
          <motion.div 
            key={student.id} 
            className={styles.card}
            whileHover={{ y: -5 }}
          >
            <div className={styles.imageWrapper}>
              <img src={student.imageUrl} alt={student.title} />
            </div>
            <div className={styles.info}>
              <h3>{student.title}</h3>
              <p>{student.description.substring(0, 100)}...</p>
              <button 
                className={styles.moreBtn}
                onClick={() => setSelectedStudent(student)}
              >
                Толук маалымат
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* МОДАЛДЫК ТЕРЕЗЕ */}
      <AnimatePresence>
        {selectedStudent && (
          <div className={styles.modalOverlay} onClick={() => setSelectedStudent(null)}>
            <motion.div 
              className={styles.modalContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={() => setSelectedStudent(null)}>&times;</button>
              <img src={selectedStudent.imageUrl} alt={selectedStudent.title} className={styles.modalImg} />
              <div className={styles.modalBody}>
                <h2>{selectedStudent.title}</h2>
                <span className={styles.modalDate}>📅 {selectedStudent.date}</span>
                <div className={styles.fullDesc}>
                  {selectedStudent.description}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BestStudents;