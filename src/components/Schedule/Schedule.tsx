import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { CalendarDays, Clock3, GraduationCap, Loader2, Search, Sparkles } from 'lucide-react';
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

  const lessonLines = useMemo(() => {
    const rawLessons = schedule[0]?.lessons || "";
    return rawLessons
      .split(/\r?\n/)
      .map((lesson) => lesson.trim())
      .filter(Boolean);
  }, [schedule]);

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
    <div className={styles.schedulePage}>
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.heroContent}
        >
          <span className={styles.eyebrow}>
            <CalendarDays size={18} />
            Окуу тартиби
          </span>
          <h1 className={styles.title}>Сабактардын расписаниеси</h1>
          <p className={styles.subtitle}>
            Классты жана күндү тандаңыз. Расписание Firebase базасынан түз жаңыланып турат.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className={styles.summaryCard}
        >
          <div className={styles.summaryIcon}>
            <Sparkles size={24} />
          </div>
          <div>
            <span>Тандалган расписание</span>
            <strong>{selectedClass} • {selectedDay}</strong>
          </div>
        </motion.div>
      </section>

      <section className={styles.controlsPanel}>
        <div className={styles.classSelector}>
          <label htmlFor="class-select">
            <GraduationCap size={18} />
            Класс
          </label>
          <select
            id="class-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className={styles.tabsContainer} aria-label="Күндү тандоо">
          <div className={styles.tabs}>
            {days.map((day) => (
              <button
                key={day}
                className={selectedDay === day ? styles.activeTab : styles.tab}
                onClick={() => setSelectedDay(day)}
                type="button"
              >
                {day}
                {selectedDay === day && (
                  <motion.div layoutId="schedule-active-day" className={styles.underline} />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay + selectedClass}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={styles.tableWrapper}
        >
          {loading ? (
            <div className={styles.stateCard}>
              <Loader2 className={styles.spinner} size={34} />
              <p className={styles.infoText}>Расписание жүктөлүүдө...</p>
            </div>
          ) : schedule.length > 0 ? (
            <div className={styles.lessonsCard}>
              <div className={styles.cardHeader}>
                <div>
                  <span className={styles.cardKicker}>Сабактар тизмеси</span>
                  <h2>{selectedClass} - {selectedDay}</h2>
                </div>
                <div className={styles.lessonCount}>
                  <Clock3 size={18} />
                  {lessonLines.length || 1} сабак
                </div>
              </div>

              {lessonLines.length > 0 ? (
                <ol className={styles.lessonsList}>
                  {lessonLines.map((lesson, index) => (
                    <li className={styles.lessonItem} key={`${lesson}-${index}`}>
                      <span className={styles.lessonNumber}>{index + 1}</span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className={styles.rawLessons}>{schedule[0].lessons}</p>
              )}
            </div>
          ) : (
            <div className={styles.stateCard}>
              <Search size={36} />
              <h3>Расписание табылган жок</h3>
              <p className={styles.infoText}>
                {selectedClass} үчүн {selectedDay} күнүнө расписание кошула элек.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Schedule;
