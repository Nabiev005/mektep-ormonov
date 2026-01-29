import React, { useState } from 'react';
import { pythonLevels } from './pythonLevels';
import styles from './PythonCourse.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const PythonCourse: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const level = pythonLevels[currentLevel];
  const progressPercent = ((currentLevel + 1) / pythonLevels.length) * 100;

  // Мурунку деңгээлге кайтуу
  const prevLevel = () => {
    if (currentLevel > 0) {
      setCurrentLevel(currentLevel - 1);
      setUserInput('');
      setShowHint(false);
      setOutput(null);
      setIsCorrect(false);
    }
  };

  const nextLevel = () => {
    if (currentLevel < pythonLevels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setUserInput('');
      setShowHint(false);
      setOutput(null);
      setIsCorrect(false);
    } else {
      setIsFinished(true);
    }
  };

  const checkAnswer = () => {
    if (userInput.trim().toLowerCase() === level.correctAnswer.toLowerCase()) {
      setIsCorrect(true);
      setShowHint(false);
      setOutput(level.correctAnswer);
    } else {
      setShowHint(true);
      setOutput("Error: Ката жаздыңыз, кайра аракет кылыңыз!");
      setIsCorrect(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isCorrect ? nextLevel() : checkAnswer();
    }
  };

  if (isFinished) {
    return (
      <div className={styles.finishContainer}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={styles.finishCard}>
          <h1>🏆 Керемет!</h1>
          <p>Сиз Python курсун ийгиликтүү аяктадыңыз.</p>
          <button onClick={() => window.location.href = '/'} className={styles.homeBtn}>Башкы бетке кайтуу</button>
        </motion.div>
      </div>
    );
  }

  const codeParts = level.codeExample.split(/_{4,}/);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.progressWrapper}>
          <div className={styles.progressInfo}>
            <span>Тема: {level.id} / {pythonLevels.length}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className={styles.progressBar}>
            <motion.div 
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentLevel}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            className={styles.card}
          >
            <h2 className={styles.title}>🐍 {level.title}</h2>
            <p className={styles.description}>{level.description}</p>

            <div className={`${styles.editor} ${isCorrect ? styles.correctGlow : ''}`}>
              <div className={styles.editorHeader}>
                <div className={styles.dots}><span/><span/><span/></div>
                <span className={styles.fileName}>main.py</span>
              </div>
              <div className={styles.codeArea}>
                <pre className={styles.pre}>
                  <code>
                    {codeParts.map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i !== codeParts.length - 1 && (
                          <input
                            type="text"
                            className={styles.inlineInput}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isCorrect}
                            placeholder="..."
                            autoFocus
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            <div className={styles.terminal}>
              <div className={styles.terminalHeader}>Output (Натыйжа)</div>
              <div className={styles.terminalBody}>
                {output && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ color: isCorrect ? '#10b981' : '#ef4444' }}>
                    {isCorrect ? `>>> ${output}` : output}
                  </motion.div>
                )}
              </div>
            </div>

            {showHint && (
              <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={styles.hint}>
                💡 <b>Кыйытма:</b> {level.hint}
              </motion.div>
            )}

            {/* Баскычтарды башкаруу бөлүгү */}
            <div className={styles.buttonGroup}>
              {currentLevel > 0 && (
                <button onClick={prevLevel} className={styles.prevBtn}>
                  ← Артка
                </button>
              )}

              {isCorrect ? (
                <button onClick={nextLevel} className={styles.nextBtn}>
                  Кийинки кадам ➜
                </button>
              ) : (
                <button onClick={checkAnswer} className={styles.checkBtn}>
                  Текшерүү ➜
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PythonCourse;