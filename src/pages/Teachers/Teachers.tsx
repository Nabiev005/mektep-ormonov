import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, GraduationCap, Search, Users, X } from 'lucide-react';
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
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Teacher[];
        
        setTeachers(data.sort((a, b) => a.title.localeCompare(b.title, 'ky')));
      } catch (error) {
        console.error("Мугалимдерди жүктөөнү ката кетти:", error);
        setError('Мугалимдерди жүктөөдө ката кетти. Интернетти текшерип, кайра аракет кылыңыз.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter((teacher) => {
    const search = `${teacher.title} ${teacher.description}`.toLowerCase();
    return search.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>
          <span className={styles.loaderIcon}></span>
          Мугалимдер жүктөлүүдө...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.hero}
      >
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <GraduationCap size={18} />
            Мектеп жамааты
          </span>
          <h1 className={styles.pageTitle}>Биздин кадырлуу мугалимдерибиз</h1>
          <p className={styles.subtitle}>
            Окуучулардын билимин, тарбиясын жана келечегин калыптандырган
            педагогдор тууралуу маалымат.
          </p>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <Users size={22} />
            <strong>{teachers.length}</strong>
            <span>мугалим</span>
          </div>
          <div className={styles.statCard}>
            <BookOpen size={22} />
            <strong>1-11</strong>
            <span>класстар</span>
          </div>
        </div>
      </motion.section>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={19} />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Мугалимди аты же маалыматы боюнча издөө..."
          />
        </div>
        <span className={styles.resultCount}>{filteredTeachers.length} профиль</span>
      </div>

      <div className={styles.teachersGrid}>
        {error ? (
          <div className={styles.noData}>
            <Search size={34} />
            <h3>Маалымат жүктөлгөн жок</h3>
            <p>{error}</p>
          </div>
        ) : filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher, index) => (
            <motion.div 
              key={teacher.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={styles.teacherCard}
            >
              <div className={styles.imageBox}>
                <img src={teacher.imageUrl} alt={teacher.title} />
                <span className={styles.imageBadge}>
                  <Award size={15} />
                  Педагог
                </span>
              </div>
              <div className={styles.infoBox}>
                <h3>{teacher.title}</h3>
                <p className={styles.subject}>
                  {teacher.description.length > 50 
                    ? `${teacher.description.substring(0, 92)}...` 
                    : teacher.description}
                </p>
                <button 
                  className={styles.detailBtn}
                  onClick={() => setSelectedTeacher(teacher)}
                  type="button"
                >
                  Толук маалымат
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className={styles.noData}>
            <Search size={34} />
            <h3>Маалымат табылган жок</h3>
            <p>Издөө сөзүн өзгөртүп көрүңүз же мугалимдер базасына маалымат кошуңуз.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedTeacher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setSelectedTeacher(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={() => setSelectedTeacher(null)} type="button" aria-label="Жабуу">
                <X size={22} />
              </button>
              
              <div className={styles.modalBody}>
                <img src={selectedTeacher.imageUrl} alt={selectedTeacher.title} className={styles.modalImg} />
                <div className={styles.modalInfo}>
                  <span className={styles.modalKicker}>Мугалимдин профили</span>
                  <h2>{selectedTeacher.title}</h2>
                  <div className={styles.fullBio}>
                    <strong>Биографиясы жана иш тажрыйбасы:</strong>
                    <p>{selectedTeacher.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teachers;
