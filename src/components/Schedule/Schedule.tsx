import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import styles from './Schedule.module.css';

interface Lesson {
  id: string;
  className: string;
  day: string;
  lessons: string;
}

const Schedule: React.FC = () => {
  const days = ["Дүйшөмбү", "Шейшемби", "Шаршемби", "Бейшемби", "Жума", "Ишемби"];
  const classes = [
    "1-класс", "2-класс", "3-класс", "4-класс", "5-класс", 
    "6-класс", "7-класс", "8-класс", "9-класс", "10-класс", "11-класс"
  ];

  const [selectedDay, setSelectedDay] = useState("Дүйшөмбү");
  const [selectedClass, setSelectedClass] = useState("1-класс");
  const [schedule, setSchedule] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    // Тандалган класс жана күн боюнча базадан издөө
    const q = query(
      collection(db, "schedule"), 
      where("className", "==", selectedClass),
      where("day", "==", selectedDay)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lesson[];
      setSchedule(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedClass, selectedDay]);

  return (
    <div className={styles.scheduleContainer}>
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.title}
      >
        Сабактардын расписаниеси
      </motion.h2>

      <div className={styles.classSelector}>
        <label>Классты тандаңыз: </label>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {days.map((day) => (
            <button 
              key={day}
              className={selectedDay === day ? styles.activeTab : styles.tab}
              onClick={() => setSelectedDay(day)}
            >
              {day}
              {selectedDay === day && (
                <motion.div layoutId="underline" className={styles.underline} />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay + selectedClass}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={styles.tableWrapper}
        >
          {loading ? (
            <p className={styles.infoText}>Жүктөлүүдө...</p>
          ) : schedule.length > 0 ? (
            <div className={styles.lessonsCard}>
              <h3>{selectedClass} - {selectedDay}</h3>
              <pre className={styles.lessonsList}>{schedule[0].lessons}</pre>
            </div>
          ) : (
            <div className={styles.noDataCard}>
              <p className={styles.infoText}>📭 Бул күн үчүн расписание кошула элек.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Schedule;