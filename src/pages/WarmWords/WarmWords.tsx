import React, { useState, useEffect } from 'react';
import styles from './WarmWords.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircleHeart, PenLine, Send, ShieldCheck, Sparkles, Trash2, UsersRound } from 'lucide-react';
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

interface Compliment {
  id: string;
  text: string;
  date: string;
  color: string;
  ownerUid?: string;
}

const forbiddenWords = ["жаман", "начар", "акмак"]; // Фильтр

const WarmWords: React.FC = () => {
  const [text, setText] = useState("");
  const [compliments, setCompliments] = useState<Compliment[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [sending, setSending] = useState(false);
  const remainingChars = 200 - text.length;
  const myNotesCount = user ? compliments.filter(note => note.ownerUid === user.uid).length : 0;

  // Атыңыз эч жерде көрүнбөйт — бул тек "менин жазганым" деп аныктоо үчүн үнсүз анонимдүү сессия.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch(() => undefined);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'warm_words'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCompliments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Compliment[]);
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    const hasForbidden = forbiddenWords.some(word => text.toLowerCase().includes(word));
    if (text.length < 5 || hasForbidden) {
      alert("Сураныч, жылуу сөз жазыңыз!");
      return;
    }
    if (!user) {
      alert("Бир аз күтүп, кайра аракет кылыңыз — байланыш даярдалууда.");
      return;
    }

    const colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
    setSending(true);
    try {
      await addDoc(collection(db, 'warm_words'), {
        text,
        date: new Date().toLocaleDateString(),
        color: colors[Math.floor(Math.random() * colors.length)],
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch {
      alert("Жөнөтүүдө ката кетти. Кайра аракет кылыңыз.");
    } finally {
      setSending(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'warm_words', id));
    } catch {
      alert("Өчүрүүдө ката кетти.");
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className={styles.eyebrow}><MessageCircleHeart size={18} /> Мектептин жылуу бурчу</span>
          <h1>Анонимдүү сөздөр</h1>
          <p>
            Классташыңа, мугалимиңе же досуңа жакшы тилек калтыр. Бул дубал сый-урмат,
            колдоо жана жакшы маанай үчүн түзүлгөн.
          </p>

          <div className={styles.heroStats}>
            <div>
              <Sparkles size={20} />
              <strong>{compliments.length}</strong>
              <span>жылуу сөз</span>
            </div>
            <div>
              <PenLine size={20} />
              <strong>{myNotesCount}</strong>
              <span>сен жазган</span>
            </div>
            <div>
              <ShieldCheck size={20} />
              <strong>таза</strong>
              <span>сөздөр гана</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.composerCard}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <div className={styles.composerHead}>
            <div className={styles.composerIcon}><Heart size={22} /></div>
            <div>
              <h2>Жакшы сөз калтыр</h2>
              <p>Атың көрүнбөйт, бирок жакшы ниетиң көрүнөт.</p>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Мисалы: Сен бүгүн сабакта мыкты жооп бердиң, аракетин күчтүү!"
            maxLength={200}
          />
          <div className={styles.composerFooter}>
            <span className={remainingChars < 25 ? styles.warningCount : ''}>{remainingChars} белги калды</span>
            <button onClick={handleSend} className={styles.sendBtn} disabled={sending}>
              <Send size={19} /> {sending ? 'Жөнөтүлүүдө...' : 'Жөнөтүү'}
            </button>
          </div>
        </motion.div>
      </section>

      <div className={styles.wall}>
        <AnimatePresence mode='popLayout'>
          {compliments.length === 0 && (
            <motion.div
              className={styles.emptyState}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <UsersRound size={42} />
              <h2>Дубал азырынча бош</h2>
              <p>Биринчи болуп жакшы сөз жазып, мектепке жылуу маанай кош.</p>
            </motion.div>
          )}

          {compliments.map((note, index) => (
            <motion.div
              key={note.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: (parseInt(note.id.slice(-1), 36) % 6) - 3 // Туруктуу рандомдук rotate
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={styles.sticker}
              style={{ backgroundColor: note.color }}
            >
              <div className={styles.pin}><Heart size={11} fill="currentColor" /></div>
              <span className={styles.noteNumber}>#{compliments.length - index}</span>
              <p className={styles.noteText}>{note.text}</p>
              <div className={styles.footer}>
                <span className={styles.date}>{note.date}</span>
                {/* Өчүрүү баскычы: Эгер өзүң жазган болсоң гана көрүнөт */}
                {user && note.ownerUid === user.uid && (
                  <button
                    onClick={() => deleteNote(note.id)}
                    className={styles.deleteBtn}
                    title="Өчүрүү"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <Heart className={styles.heartIcon} size={40} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WarmWords;
