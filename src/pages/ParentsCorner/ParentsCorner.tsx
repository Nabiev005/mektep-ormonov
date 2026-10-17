import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, limit, onSnapshot, orderBy, query, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import styles from './ParentsCorner.module.css';

interface ParentComment {
  id: string;
  name: string;
  text: string;
  createdAt?: Timestamp | null;
}

const ParentsCorner: React.FC = () => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<ParentComment[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'parent_comments'), orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ParentComment, 'id'>) })));
    });
  }, []);

  // Админ укугу Firestore'догу admins коллекциясынан текшерилет (localStorage'га ишенбейбиз).
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setIsAdmin(user ? (await getDoc(doc(db, 'admins', user.uid))).exists() : false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    setSending(true);
    setError('');
    try {
      await addDoc(collection(db, 'parent_comments'), {
        name: name.trim().slice(0, 60),
        text: comment.trim().slice(0, 1000),
        createdAt: serverTimestamp(),
      });
      setName('');
      setComment('');
    } catch {
      setError('Пикирди жөнөтүүдө ката кетти. Кайра аракет кылыңыз.');
    } finally {
      setSending(false);
    }
  };

  const deleteComment = async (id: string) => {
    if (!window.confirm("Бул пикирди өчүрүүнү каалайсызбы?")) return;
    try {
      await deleteDoc(doc(db, 'parent_comments', id));
    } catch {
      alert('Өчүрүүдө ката кетти.');
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
            <button type="submit" className={styles.submitBtn} disabled={sending}>
              {sending ? 'Жөнөтүлүүдө...' : <>Жөнөтүү <span>→</span></>}
            </button>
            {error && <p role="alert">{error}</p>}
          </form>

          <div className={styles.commentsList}>
            <AnimatePresence mode="popLayout">
              {comments.length === 0 && <p>Азырынча пикир жок. Биринчи болуп жазыңыз.</p>}
              {comments.map((c) => {
                const showDelete = isAdmin;

                return (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={styles.commentCard}
                  >
                    <div className={styles.commentAvatar}>
                      {c.name.charAt(0)}
                    </div>
                    <div className={styles.commentContent}>
                      <div className={styles.commentHeader}>
                        <div className={styles.userInfo}>
                          <h4>{c.name}</h4>
                          <span className={styles.date}>{c.createdAt ? c.createdAt.toDate().toLocaleDateString('ky-KG') : 'Азыр'}</span>
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