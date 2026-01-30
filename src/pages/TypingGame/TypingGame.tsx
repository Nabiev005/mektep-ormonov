import React, { useState, useEffect, useRef } from 'react';
import styles from './TypingGame.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { WORDS_DATA, type LanguageType } from './wordData';

const TypingGame: React.FC = () => {
  const [language, setLanguage] = useState<LanguageType>('kg');
  const [words, setWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isError, setIsError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const initGame = (lang: LanguageType) => {
    const shuffled = [...WORDS_DATA[lang]].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentIndex(0);
    setUserInput('');
    setTimeLeft(30);
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalAttempts(0);
    setIsError(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { initGame(language); }, [language]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        const timePassed = (30 - timeLeft + 1) / 60;
        setWpm(Math.round((correctChars / 5) / timePassed) || 0);
      }, 1000);
    } else if (timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, correctChars]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive && timeLeft > 0) setIsActive(true);
    const value = e.target.value;
    const targetWord = words[currentIndex];

    // Реалдуу убакытта катаны текшерүү (кызыл түс үчүн)
    if (value.trim() !== "" && !targetWord.startsWith(value.trim())) {
      setIsError(true);
    } else {
      setIsError(false);
    }

    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      setTotalAttempts(prev => prev + 1);

      if (typedWord === targetWord) {
        // ТУУРА ЖАЗЫЛСА
        setCorrectChars(prev => prev + targetWord.length);
        setAccuracy(Math.round(((currentIndex + 1) / (totalAttempts + 1)) * 100));
        setUserInput('');
        setCurrentIndex(prev => prev + 1);
        setIsError(false);
        
        if (currentIndex >= words.length - 1) initGame(language);
      } else {
        // КАТА ЖАЗЫЛСА - Инпутту тазалап, катаны көрсөтөбүз
        setIsError(true);
        setUserInput(''); // Студент кайра башынан жазууга мажбур
        // Визуалдык эффект үчүн бир аз кечиктирип катаны өчүрөбүз
        setTimeout(() => setIsError(false), 300);
      }
    } else {
      setUserInput(value);
    }
  };

  return (
    <div className={styles.wrapper} onClick={() => inputRef.current?.focus()}>
      <div className={styles.card}>
        <div className={styles.config}>
          {(['kg', 'ru', 'en'] as LanguageType[]).map((l) => (
            <button 
              key={l} 
              onClick={() => setLanguage(l)} 
              className={language === l ? styles.activeBtn : ''}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}>убакыт: <span>{timeLeft}с</span></div>
          <div className={styles.stat}>wpm: <span>{wpm}</span></div>
          <div className={styles.stat}>тактык: <span>{accuracy}%</span></div>
        </div>

        <div className={styles.wordArea}>
          {words.slice(currentIndex, currentIndex + 10).map((word, i) => (
            <span 
              key={currentIndex + i} 
              className={`${i === 0 ? styles.currentWord : styles.futureWord} ${i === 0 && isError ? styles.wordError : ''}`}
            >
              {word}
            </span>
          ))}
        </div>

        <div className={styles.inputBox}>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInput}
            placeholder={isActive ? "" : "Жазууну баштаңыз..."}
            disabled={timeLeft === 0}
            className={`${styles.mainInput} ${isError ? styles.inputError : ''}`}
          />
        </div>

        <AnimatePresence>
          {timeLeft === 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.result}>
              <p>Оюн бүттү! Сиздин ылдамдык: {wpm} WPM</p>
              <button className={styles.restartBtn} onClick={() => initGame(language)}>
                КАЙРА БАШТОО
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TypingGame;