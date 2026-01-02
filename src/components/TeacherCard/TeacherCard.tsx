import React from 'react';
import { motion } from 'framer-motion';
import type { Teacher } from '../../types';
import styles from './TeacherCard.module.css';

interface Props {
  teacher: Teacher;
}

const TeacherCard: React.FC<Props> = ({ teacher }) => {
  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={styles.imageContainer}>
        <img src={teacher.photoUrl} alt={teacher.name} className={styles.photo} />
        <div className={styles.overlay}>
          <span className={styles.experienceTag}>{teacher.experience} тажрыйба</span>
        </div>
      </div>
      
      <div className={styles.info}>
        <h3 className={styles.name}>{teacher.name}</h3>
        <p className={styles.subject}>{teacher.subject}</p>
        
        <div className={styles.divider}></div>
        
        <motion.button 
          className={styles.button}
          whileTap={{ scale: 0.95 }}
        >
          Толук маалымат
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TeacherCard;