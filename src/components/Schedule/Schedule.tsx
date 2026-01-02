import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scheduleData } from '../../data/scheduleData';
import styles from './Schedule.module.css';

const Schedule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(scheduleData[0].day);

  const currentDayData = scheduleData.find(d => d.day === selectedDay);

  return (
    <div className={styles.scheduleContainer}>
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.title}
      >
        Сабактардын расписаниеси
      </motion.h2>

      {/* Күндөр тандалуучу бөлүк */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {scheduleData.map((item) => (
            <button 
              key={item.day}
              className={selectedDay === item.day ? styles.activeTab : styles.tab}
              onClick={() => setSelectedDay(item.day)}
            >
              {item.day}
              {selectedDay === item.day && (
                <motion.div layoutId="underline" className={styles.underline} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Таблица бөлүгү анимация менен */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={styles.tableWrapper}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Убактысы</th>
                <th>Предмет</th>
                <th>Мугалим</th>
                <th>Кабинет</th>
              </tr>
            </thead>
            <tbody>
              {currentDayData?.lessons.map((lesson) => (
                <tr key={lesson.id} className={styles.row}>
                  <td data-label="Убактысы">{lesson.time}</td>
                  <td data-label="Предмет" className={styles.subject}>{lesson.subject}</td>
                  <td data-label="Мугалим">{lesson.teacher}</td>
                  <td data-label="Кабинет"><span className={styles.roomBadge}>{lesson.room}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Schedule;