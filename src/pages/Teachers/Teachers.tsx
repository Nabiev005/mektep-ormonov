import React from 'react';
import { motion } from 'framer-motion';
import TeacherCard from '../../components/TeacherCard/TeacherCard';
import { teacherData } from '../../data/teacherData';
import styles from './Teachers.module.css';

const Teachers: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className={styles.container}
    >
      <h2 className={styles.title}>Биздин мугалимдер</h2>
      <div className={styles.grid}>
        {teacherData.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </motion.div>
  );
};

export default Teachers;