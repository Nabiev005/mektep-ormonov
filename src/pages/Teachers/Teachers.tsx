import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Сиз түзгөн firebase файлы
import { collection, getDocs } from 'firebase/firestore';
import { motion } from 'framer-motion';
import styles from './Teachers.module.css';

interface Teacher {
  id: string;
  title: string;       // Мугалимдин аты-жөнү
  description: string; // Сабагы же кыскача маалымат
  imageUrl: string;    // Сүрөт шилтемеси
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // "teachers" коллекциясынан маалымат алуу
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
                <p className={styles.subject}>{teacher.description}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className={styles.noData}>Мугалимдер тууралуу маалымат табылган жок.</p>
        )}
      </div>
    </div>
  );
};

export default Teachers;