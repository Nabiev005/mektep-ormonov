import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AIChatBot.module.css';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<{ type: 'bot' | 'user', text: string }[]>([
    { type: 'bot', text: 'Салам! Мен мектептин санарип жардамчысымын. Сизге кантип жардам бере алам?' }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Жаңы билдирүү келгенде автоматтык түрдө төмөн сыдыруу
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isTyping]);

  const qaDatabase = [
    { q: "Мектеп кайда жайгашкан?", a: "Биздин мектептин дареги: Баткен району, Алтын бешик аймагы Кан айылы" },
    { q: "Сайтты ким жасаган?", a: "Бул заманбап сайтты мектептин сыймыктуу программисти Айбек, TypeScript фрейворк менен биргеликте иштеп чыккан. 🚀" },
    { q: "Расписаниени кайдан көрөм?", a: "Башкы беттеги 'Расписание' бөлүмүнө өтүп, өзүңүздүн классыңызды тандасаңыз болот." },
    { q: "Байланыш телефондору?", a: "Мектептин кабыл алуу бөлүмү: +996 (702) 95-22-00." }
  ];

  const handleQuestion = (question: string, answer: string) => {
    if (isTyping) return; // Бот жазып жатканда кайра басууга болбойт

    setHistory(prev => [...prev, { type: 'user', text: question }]);
    
    // Боттун "ойлонуп" жаткан учуру
    setTimeout(() => {
      setIsTyping(true);
      
      // Жоопту бир аз кечиктирип чыгаруу (чыныгы эффект)
      setTimeout(() => {
        setHistory(prev => [...prev, { type: 'bot', text: answer }]);
        setIsTyping(false);
      }, 1500);
    }, 400);
  };

  return (
    <div className={styles.botWrapper}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={styles.chatWindow}
          >
            <div className={styles.chatHeader}>
              <div className={styles.headerInfo}>
                <div className={styles.onlineDot} />
                <span>✨ Санарип Жардамчы</span>
              </div>
              <button onClick={() => setIsOpen(false)}>&times;</button>
            </div>

            <div className={styles.chatBody}>
              {history.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.type === 'bot' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
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

            <div className={styles.questionGrid}>
              <p>Тез суроолор:</p>
              <div className={styles.btnScrollArea}>
                {qaDatabase.map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handleQuestion(item.q, item.a)}
                    className={styles.qBtn}
                    disabled={isTyping}
                  >
                    {item.q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={styles.fab}
      >
        <span className={styles.icon}>{isOpen ? '✕' : '💬'}</span>
      </motion.button>
    </div>
  );
};

export default AIChatBot;