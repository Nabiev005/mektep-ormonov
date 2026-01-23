/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import styles from './WarmWords.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Send, Heart } from 'lucide-react';

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
      <div className={styles.headerSection}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          ✨ Жылуу сөздөр дубалы
        </motion.h1>
        <p>Бири-бирибизге позитив тартуулайлы!</p>
        
        <div className={styles.inputArea}>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Кимге жана кандай жакшы сөз айткыңыз келет?.."
            maxLength={200}
          />
          <button onClick={handleSend} className={styles.sendBtn}>
            <Send size={20} /> Жөнөтүү
          </button>
        </div>
      </div>

      <div className={styles.wall}>
        <AnimatePresence mode='popLayout'>
          {compliments.map((note) => (
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
              <div className={styles.pin}></div>
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