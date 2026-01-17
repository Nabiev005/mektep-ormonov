import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';
import styles from './BestStudents.module.css';

interface Student {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
}

// Ар бир окуучунун картасы үчүн өзүнчө компонент (Flip логикасы менен)
const StudentCard = ({ student }: { student: Student }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={styles.cardContainer}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className={styles.cardInner}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* АЛДЫҢКЫ БЕТИ */}
        <div className={styles.cardFront}>
          <div className={styles.imageWrapper}>
            <img src={student.imageUrl} alt={student.title} />
          </div>
          <div className={styles.frontInfo}>
            <h3>{student.title}</h3>
            <span className={styles.badge}>Мектеп Сыймыгы</span>
          </div>
        </div>

        {/* АРТКЫ БЕТИ */}
        <div className={styles.cardBack}>
          <div className={styles.backContent}>
            <h4>Жетишкендиктери</h4>
            <div className={styles.divider}></div>
            <p>{student.description}</p>
            {student.date && <span className={styles.date}>📅 {student.date}</span>}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const BestStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p>Окуучулар жүктөлүүдө...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className={styles.headerSection}
      >
        <h1 className={styles.title}>🌟 Биздин мыкты окуучуларыбыз</h1>
        <p className={styles.subtitle}>Билими жана таланты менен мектебибиздин атын чыгарган сыймыктарыбыз</p>
      </motion.div>

      <div className={styles.grid}>
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
};

export default BestStudents;