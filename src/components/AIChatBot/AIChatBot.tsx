import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AIChatBot.module.css';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<{ type: 'bot' | 'user', text: string }[]>([
    { type: 'bot', text: 'Салам! Мен Кан айылындагы мектептин санарип жардамчысымын. Сизге кандай маалымат керек?' }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [history, isTyping, isOpen]);

  const qaDatabase = [
    { q: "📍 Мектеп кайда?", a: "Биздин мектептин дареги: Баткен району, Алтын бешик аймагы, Кан айылы. Сизди ар дайым күтөбүз!" },
    { q: "💻 Сайт тууралуу", a: "Бул заманбап платформаны мектебибиздин сыймыктуу бүтүрүүчүсү Набиев Айбек иштеп чыккан. Ал учурда Бишкектеги TechnoPark IT компаниясында Frontend разработчик. 🚀" },
    { q: "📅 Расписание", a: "Расписание бөлүмүнө өтүп, классыңызды тандаңыз. Маалыматтар дайыма жаңыланып турат." },
    { q: "📞 Байланыш", a: "Биз менен байланышуу үчүн: +996 (702) 95-22-00 номерине чалсаңыз болот." }
  ];

  const handleQuestion = (question: string, answer: string) => {
    if (isTyping) return;
    setHistory(prev => [...prev, { type: 'user', text: question }]);
    
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setHistory(prev => [...prev, { type: 'bot', text: answer }]);
        setIsTyping(false);
      }, 1200);
    }, 300);
  };

  return (
    <div className={styles.botWrapper}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
           initial={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
           animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
           exit={{ opacity: 0, y: 40, scale: 0.9, filter: "blur(10px)" }}
           className={styles.chatWindow}
          >
            <div className={styles.chatHeader}>
              <div className={styles.headerInfo}>
                <div className={styles.statusGroup}>
                  <div className={styles.onlineDot} />
                  <div className={styles.dotWave} />
                </div>
                <span className={styles.headerTitle}>✨ Санарип Жардамчы</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
            </div>

            <div className={styles.chatBody}>
              {history.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={index} 
                  className={msg.type === 'bot' ? styles.botMsg : styles.userMsg}
                >
                  {msg.text}
                </motion.div>
              ))}

              {isTyping && (
                <div className={styles.botMsg}>
                  <div className={styles.typingIndicator}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.questionSection}>
              <div className={styles.divider}>
                <span>Тез суроолор</span>
              </div>
              <div className={styles.btnScrollArea}>
                {qaDatabase.map((item, idx) => (
                  <motion.button 
                    whileHover={{ x: 5 }}
                    key={idx} 
                    onClick={() => handleQuestion(item.q, item.a)}
                    className={styles.qBtn}
                    disabled={isTyping}
                  >
                    {item.q}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        animate={!isOpen ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.fab} ${isOpen ? styles.fabActive : ''}`}
      >
        <span className={styles.icon}>{isOpen ? '✕' : '💬'}</span>
      </motion.button>
    </div>
  );
};

export default AIChatBot;