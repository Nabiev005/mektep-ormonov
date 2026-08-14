import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ParentsCorner.module.css';

const ParentsCorner: React.FC = () => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  // Админ экенин текшерүү (Сиз текшерүү үчүн localStorage'га isAdmin: true деп жазып койсоңуз болот)
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [comments, setComments] = useState<any[]>(() => {
    const saved = localStorage.getItem('school_comments');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, name: "Айнура Маматова", text: "Мектептин жаңы имараты абдан жагат, балдарга жакшы шарттар түзүлгөн.", date: "15.01.2026", timestamp: Date.now() - 86400000 },
      { id: 2, name: "Бакыт Токтосунов", text: "Мугалимдерге чоң рахмат, билим берүү деңгээли жогору.", date: "17.01.2026", timestamp: Date.now() - 43200000 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('school_comments', JSON.stringify(comments));
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && comment.trim()) {
      const newComment = {
        id: Date.now(),
        name: name,
        text: comment,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now() // Жазылган убактысын сактайбыз
      };
      setComments([newComment, ...comments]);
      setName('');
      setComment('');
    }
  };

  const deleteComment = (id: number) => {
    if (window.confirm("Бул пикирди өчүрүүнү каалайсызбы?")) {
      setComments(comments.filter(c => c.id !== id));
    }
  };

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      <div className={styles.container}>
        <h1 className={styles.title}>Ата-энелер бурчу</h1>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>📋</div>
            <h3>Кабыл алуу</h3>
            <p>1-класска кабыл алуу үчүн керектүү документтердин тизмеси жана эрежелери.</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>👕</div>
            <h3>Мектеп формасы</h3>
            <p>Мектептин бекитилген формасы: ак көйнөк, кочкул көк түстөгү костюм-шым.</p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.cardIcon}>📈</div>
            <h3>Баланыздын прогресси</h3>
            <p>
              Ар бир окуучу "Окуучу панели" бөлүмүнөн өз прогрессин (XP, сертификаттар, курстар) ачык кылып,
              сизге жеке шилтеме бере алат. Шилтемени балаӊыздан сурап, ошол link аркылуу каалаган убакта көрө аласыз —
              катталуунун кереги жок.
            </p>
          </div>
        </div>

        <section className={styles.feedbackSection}>
          <div className={styles.formHeader}>
            <h2>Пикирлер жана сунуштар</h2>
            <p>Сиздин оюңуз биз үчүн маанилүү</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Аты-жөнүңүз"
                required
                className={styles.nameInput}
              />
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Пикириңизди же сунушуңузду жазыңыз..."
                required
                className={styles.textArea}
              />
            </div>
            <button type="submit" className={styles.submitBtn}>
              Жөнөтүү <span>→</span>
            </button>
          </form>

          <div className={styles.commentsList}>
            <AnimatePresence mode="popLayout">
              {comments.map((c) => {
                // Жазганына 5 мүнөт боло элекпи же бул Админби?
                // eslint-disable-next-line react-hooks/purity
                const isNew = Date.now() - c.timestamp < 5 * 60 * 1000;
                const showDelete = isAdmin || isNew;

                return (
                  <motion.div 
                    key={c.id} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={styles.commentCard}
                    onDoubleClick={() => showDelete && deleteComment(c.id)}
                  >
                    <div className={styles.commentAvatar}>
                      {c.name.charAt(0)}
                    </div>
                    <div className={styles.commentContent}>
                      <div className={styles.commentHeader}>
                        <div className={styles.userInfo}>
                          <h4>{c.name}</h4>
                          <span className={styles.date}>{c.date}</span>
                        </div>
                        
                        {/* Өчүрүү баскычы */}
                        {showDelete && (
                          <button 
                            className={styles.deleteBtn} 
                            onClick={() => deleteComment(c.id)}
                            title="Өчүрүү"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                      <p>{c.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default ParentsCorner;