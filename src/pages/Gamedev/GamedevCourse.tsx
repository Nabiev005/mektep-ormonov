import React, { useState } from 'react';
import { gamedevLevels } from './gamedevLevels';
import styles from './GamedevCourse.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const GamedevCourse: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false); // Темалардын тизмеси үчүн

  const level = gamedevLevels[currentLevel];
  const progress = ((currentLevel + 1) / gamedevLevels.length) * 100;

  const handleCheck = () => {
    if (userInput.trim().toLowerCase() === level.correctAnswer.toLowerCase()) {
      setIsCorrect(true);
      setOutput(`>>> SUCCESS: ${level.correctAnswer} кабыл алынды!`);
    } else {
      setOutput(">>> ERROR: Коддо ката бар, кайра аракет кыл!");
    }
  };

  const nextStep = () => {
    if (currentLevel < gamedevLevels.length - 1) {
      goToLevel(currentLevel + 1);
    }
  };

  const prevStep = () => {
    if (currentLevel > 0) {
      goToLevel(currentLevel - 1);
    }
  };

  const goToLevel = (index: number) => {
    setCurrentLevel(index);
    setUserInput('');
    setIsCorrect(false);
    setOutput(null);
    setShowMenu(false); // Теманы тандаганда меню жабылат
  };

  return (
    <div className={styles.wrapper}>
      {/* ТЕМАЛАРДЫН ТИЗМЕСИ (Sidebar Menu) */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            initial={{ x: -300 }} 
            animate={{ x: 0 }} 
            exit={{ x: -300 }} 
            className={styles.sidebar}
          >
            <div className={styles.sidebarHeader}>
              <h3>Бардык темалар</h3>
              <button onClick={() => setShowMenu(false)}>✕</button>
            </div>
            <div className={styles.levelList}>
              {gamedevLevels.map((lvl, index) => (
                <div 
                  key={lvl.id} 
                  className={`${styles.levelItem} ${index === currentLevel ? styles.activeLevel : ''}`}
                  onClick={() => goToLevel(index)}
                >
                  <span>{lvl.id}.</span> {lvl.title}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.container}>
        <div className={styles.topNav}>
          <button onClick={() => setShowMenu(true)} className={styles.menuBtn}>☰ Темалар</button>
          <div className={styles.levelInfo}>GAMEDEV: {level.id} / {gamedevLevels.length}</div>
        </div>

        <div className={styles.progressBar}>
          <motion.div className={styles.fill} animate={{ width: `${progress}%` }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentLevel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.mainCard}
          >
            <h1 className={styles.title}>🎮 {level.title}</h1>
            
            <div className={styles.theoryCard}>
              <span className={styles.label}>[ ТЕОРИЯ ]</span>
              <p>{level.theory}</p>
            </div>

            <p className={styles.taskText}>{level.description}</p>

            <div className={`${styles.editor} ${isCorrect ? styles.glow : ''}`}>
              <div className={styles.editorTop}>
                <div className={styles.file}>game_logic.js</div>
              </div>
              <div className={styles.code}>
                <pre>
                  {level.codeExample.split('____')[0]}
                  <input 
                    className={styles.input}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="..."
                    autoFocus
                  />
                  {level.codeExample.split('____')[1]}
                </pre>
              </div>
            </div>

            <div className={styles.terminal}>
               <div className={styles.termBody} style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
                 {output || ">>> Кодду күтүүдө..."}
               </div>
            </div>

            <div className={styles.actions}>
              <button onClick={prevStep} className={styles.prevBtn} disabled={currentLevel === 0}>
                ← Артка
              </button>
              {isCorrect ? (
                <button onClick={nextStep} className={styles.nextBtn}>КИЙИНКИ ➜</button>
              ) : (
                <button onClick={handleCheck} className={styles.checkBtn}>ТЕКШЕРҮҮ ⚙️</button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamedevCourse;