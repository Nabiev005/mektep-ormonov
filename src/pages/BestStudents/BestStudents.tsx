import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, CalendarDays, Medal, Search, Sparkles, Star, Trophy, Users, X } from 'lucide-react';
import styles from './BestStudents.module.css';

interface Student {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
}

const StudentCard = ({ student, onOpen }: { student: Student; onOpen: (student: Student) => void }) => {
  return (
    <motion.article
      className={styles.studentCard}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.24 }}
    >
      <div className={styles.imageWrapper}>
        <img src={student.imageUrl} alt={student.title} />
        <span className={styles.badge}>
          <Medal size={15} />
          Мектеп сыймыгы
        </span>
      </div>
      <div className={styles.cardInfo}>
        <h3>{student.title}</h3>
        <p>{student.description.length > 120 ? `${student.description.substring(0, 120)}...` : student.description}</p>
        <div className={styles.cardFooter}>
          {student.date ? (
            <span className={styles.date}>
              <CalendarDays size={15} />
              {student.date}
            </span>
          ) : (
            <span className={styles.date}>
              <Star size={15} />
              Жетишкендик
            </span>
          )}
          <button type="button" onClick={() => onOpen(student)} className={styles.detailBtn}>
            Толук маалымат
          </button>
        </div>
      </div>
    </motion.article>
  );
};

const BestStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredStudents = students.filter((student) => {
    const search = `${student.title} ${student.description} ${student.date || ''}`.toLowerCase();
    return search.includes(searchTerm.toLowerCase());
  });

  if (loading) return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p>Окуучулар жүктөлүүдө...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 18 }} 
        animate={{ opacity: 1, y: 0 }}
        className={styles.headerSection}
      >
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>
            <Trophy size={18} />
            Мектеп сыймыктары
          </span>
          <h1 className={styles.title}>Биздин мыкты окуучуларыбыз</h1>
          <p className={styles.subtitle}>
            Билими, таланты жана жетишкендиктери менен мектебибиздин атын чыгарган окуучулар.
          </p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <Users size={22} />
            <strong>{students.length}</strong>
            <span>окуучу</span>
          </div>
          <div className={styles.statCard}>
            <Award size={22} />
            <strong>TOP</strong>
            <span>жетишкендиктер</span>
          </div>
        </div>
      </motion.div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={19} />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Окуучуну аты же жетишкендиги боюнча издөө..."
          />
        </div>
        <span className={styles.resultCount}>{filteredStudents.length} профиль</span>
      </div>

      <div className={styles.grid}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} onOpen={setSelectedStudent} />
          ))
        ) : (
          <div className={styles.noData}>
            <Search size={34} />
            <h3>Окуучу табылган жок</h3>
            <p>Издөө сөзүн өзгөртүп көрүңүз же админ панелден мыкты окуучу кошуңуз.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStudent(null)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.86 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className={styles.closeBtn} onClick={() => setSelectedStudent(null)} aria-label="Жабуу">
                <X size={22} />
              </button>
              <img src={selectedStudent.imageUrl} alt={selectedStudent.title} className={styles.modalImg} />
              <div className={styles.modalInfo}>
                <span className={styles.modalKicker}>
                  <Sparkles size={16} />
                  Мыкты окуучу
                </span>
                <h2>{selectedStudent.title}</h2>
                <strong>Жетишкендиктери</strong>
                <p>{selectedStudent.description}</p>
                {selectedStudent.date && (
                  <span className={styles.modalDate}>
                    <CalendarDays size={16} />
                    {selectedStudent.date}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BestStudents;
