import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineVolumeUp, 
  HiOutlineTrash, 
  HiOutlineX, 
  HiOutlineClipboardCopy,
  HiChatAlt2
} from "react-icons/hi";
import styles from './AIChatBot.module.css';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const [history, setHistory] = useState<{ type: 'bot' | 'user', text: string, time: string }[]>([
    { 
      type: 'bot', 
      text: 'Салам! Мен Кан айылындагы мектептин санарип жардамчысымын. Сизге кандай маалымат керек?',
      time: getCurrentTime()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Мектеп статусу (Өчүрүлгөн жок)
  const getSchoolStatus = () => {
    const hour = new Date().getHours();
    if (hour < 8) return "Мектеп азырынча жабык. Саат 08:00до ачылат. ✨";
    if (hour >= 8 && hour < 14) return "Азыр сабактар кызуу жүрүп жаткан убагы. 📚";
    return "Мектепте сабактар бүттү. Эртең күтөбүз! 🌙";
  };

  // 2. Үн чыгаруу (Жаңыланган дизайн менен)
  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ky-KY'; 
    window.speechSynthesis.speak(utterance);
  };

  // 3. Текст көчүрүү (Жаңыланган дизайн менен)
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // 4. Чатты тазалоо (Жаңы функция)
  const clearChat = () => {
    setHistory([{ type: 'bot', text: 'Чат тазаланды. Сурооңузду күтөм...', time: getCurrentTime() }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [history, isTyping, isOpen]);

  const qaDatabase = [
    { q: "📍 Мектеп кайда?", a: "Биздин мектептин дареги: Баткен району, Кан айылы. Сизди ар дайым күтөбүз!" },
    { q: "⏰ Азыркы абал?", a: getSchoolStatus() },
    { q: "📅 Расписание", a: "Расписание бөлүмүнө өтүп, классыңызды тандаңыз.", action: "schedule" },
    { q: "📞 Директорго жазуу", a: "Азыр сизди директордун WhatsApp номерине багыттайм...", action: "whatsapp" }
  ];

  const handleQuestion = (question: string, answer: string, action?: string) => {
    if (isTyping) return;
    const time = getCurrentTime();
    setHistory(prev => [...prev, { type: 'user', text: question, time }]);
    
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setHistory(prev => [...prev, { type: 'bot', text: answer, time }]);
        setIsTyping(false);

        if (action === "whatsapp") {
          setTimeout(() => window.open("https://wa.me/996770125632", "_blank"), 1000);
        }
        if (action === "schedule") {
          const el = document.getElementById('schedule-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1000);
    }, 300);
  };

  return (
    <div className={styles.botWrapper}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
           initial={{ opacity: 0, y: 50, scale: 0.8 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, y: 50, scale: 0.8 }}
           className={styles.chatWindow}
          >
            <div className={styles.chatHeader}>
              <div className={styles.headerInfo}>
                <div className={styles.avatarBox}>🤖</div>
                <div className={styles.headerText}>
                  <span className={styles.headerTitle}>Санарип Жардамчы</span>
                  <div className={styles.statusIndicator}><span></span> онлайн</div>
                </div>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.toolBtn} onClick={clearChat} title="Тазалоо"><HiOutlineTrash /></button>
                <button className={styles.toolBtn} onClick={() => setIsOpen(false)}><HiOutlineX /></button>
              </div>
            </div>

            <div className={styles.chatBody}>
              {history.map((msg, index) => (
                <div key={index} className={msg.type === 'bot' ? styles.botGroup : styles.userGroup}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={msg.type === 'bot' ? styles.botBubble : styles.userBubble}
                  >
                    <p>{msg.text}</p>
                    <div className={styles.bubbleMetadata}>
                      <span className={styles.msgTime}>{msg.time}</span>
                      {msg.type === 'bot' && (
                        <div className={styles.msgTools}>
                          <HiOutlineVolumeUp onClick={() => speakText(msg.text)} className={styles.iconAction} />
                          <HiOutlineClipboardCopy onClick={() => copyText(msg.text)} className={styles.iconAction} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
              {isTyping && (
                <div className={styles.typingBox}>
                  <span></span><span></span><span></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className={styles.questionSection}>
              <div className={styles.chipScroll}>
                {qaDatabase.map((item, idx) => (
                  <button key={idx} onClick={() => handleQuestion(item.q, item.a, item.action)} className={styles.qChip}>
                    {item.q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.fab} ${isOpen ? styles.fabActive : ''}`}
      >
        {isOpen ? <HiOutlineX /> : <HiChatAlt2 />}
      </motion.button>
    </div>
  );
};

export default AIChatBot;