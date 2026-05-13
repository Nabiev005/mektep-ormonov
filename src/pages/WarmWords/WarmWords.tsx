/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import styles from './WarmWords.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircleHeart, PenLine, Send, ShieldCheck, Sparkles, Trash2, UsersRound } from 'lucide-react';

interface Compliment {
  id: string;
  text: string;
  date: string;
  color: string;
}

const forbiddenWords = ["жаман", "начар", "акмак"]; // Фильтр

const WarmWords: React.FC = () => {
  const [text, setText] = useState("");
  const [compliments, setCompliments] = useState<Compliment[]>([]);
  const [myNotes, setMyNotes] = useState<string[]>([]);
  const remainingChars = 200 - text.length;
  const myNotesCount = compliments.filter(note => myNotes.includes(note.id)).length;

  // 1. Маалыматты жүктөө
  useEffect(() => {
    const saved = localStorage.getItem('school_compliments');
    const savedMyNotes = localStorage.getItem('my_notes_ids');
    if (saved) setCompliments(JSON.parse(saved));
    if (savedMyNotes) setMyNotes(JSON.parse(savedMyNotes));
  }, []);

  // 2. Жаңы билдирүү кошуу
  const handleSend = () => {
    const hasForbidden = forbiddenWords.some(word => text.toLowerCase().includes(word));
    if (text.length < 5 || hasForbidden) {
      alert("Сураныч, жылуу сөз жазыңыз!");
      return;
    }

    const colors = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];
    const newNote: Compliment = {
      id: Date.now().toString(),
      text: text,
      date: new Date().toLocaleDateString(),
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    const updated = [newNote, ...compliments];
    setCompliments(updated);
    
    // Өзүнүн жазганын белгилөө үчүн ID-ни сактоо
    const updatedMyNotes = [...myNotes, newNote.id];
    setMyNotes(updatedMyNotes);

    localStorage.setItem('school_compliments', JSON.stringify(updated));
    localStorage.setItem('my_notes_ids', JSON.stringify(updatedMyNotes));
    setText("");
  };

  // 3. Өчүрүү (ТОЛУКТАЛДЫ: Эми дароо экрандан жана эстен өчүрөт)
  const deleteNote = (id: string) => {
    // Стикерлердин тизмесин жаңыртуу
    const filteredCompliments = compliments.filter(note => note.id !== id);
    setCompliments(filteredCompliments);

    // "Менин жазгандарым" тизмесинен да өчүрүү
    const filteredMyIds = myNotes.filter(myId => myId !== id);
    setMyNotes(filteredMyIds);

    // Браузердин эсине сактоо
    localStorage.setItem('school_compliments', JSON.stringify(filteredCompliments));
    localStorage.setItem('my_notes_ids', JSON.stringify(filteredMyIds));
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
            <button onClick={handleSend} className={styles.sendBtn}>
              <Send size={19} /> Жөнөтүү
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
                rotate: (parseInt(note.id.slice(-1)) % 6) - 3 // Туруктуу рандомдук rotate
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
                {/* Өчүрүү баскычы: Эгер ID "myNotes" ичинде болсо гана көрүнөт */}
                {myNotes.includes(note.id) && (
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
