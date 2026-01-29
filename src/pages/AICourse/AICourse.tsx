import React, { useState } from 'react';
import { aiLevels } from './aiLevels';
import styles from './AICourse.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const AICourse: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const level = aiLevels[currentLevel];
  const progressPercent = ((currentLevel + 1) / aiLevels.length) * 100;

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
    if (currentLevel < aiLevels.length - 1) {
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
      setOutput(`>>> Сиздин жооп туура: ${level.correctAnswer}`);
    } else {
      setShowHint(true);
      setOutput("Error: Нейрондук тармак түшүнбөй жатат, теорияны кайра окуңуз!");
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
          <h1>🏆 AI Чебери!</h1>
          <p>Куттуктайбыз! Сиз Жасалма Интеллект дүйнөсүнө биринчи чоң кадамыңызды таштадыңыз.</p>
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
            <span>Бөлүм: {level.id} / {aiLevels.length}</span>
            <span>Прогресс: {Math.round(progressPercent)}%</span>
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
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={styles.card}
          >
            <h2 className={styles.title}>🤖 {level.title}</h2>

            {/* ТЕОРИЯ БЛОГУ - Окуучу үчүн эң маанилүү бөлүм */}
            <div className={styles.theoryBox}>
              <div className={styles.theoryLabel}>💡 БУЛ КЫЗЫКТУУ:</div>
              <p>{level.theory}</p>
            </div>

            <p className={styles.description}>{level.description}</p>

            <div className={`${styles.editor} ${isCorrect ? styles.correctGlow : ''}`}>
              <div className={styles.editorHeader}>
                <div className={styles.dots}><span/><span/><span/></div>
                <span className={styles.fileName}>learning_ai.py</span>
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
              <div className={styles.terminalHeader}>AI Output (Натыйжа)</div>
              <div className={styles.terminalBody}>
                {output && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: isCorrect ? '#22d3ee' : '#ef4444' }}>
                    {output}
                  </motion.div>
                )}
              </div>
            </div>

            {showHint && !isCorrect && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.hint}>
                💡 <b>Кыйытма:</b> {level.hint}
              </motion.div>
            )}

            <div className={styles.buttonGroup}>
              {currentLevel > 0 && (
                <button onClick={prevLevel} className={styles.prevBtn}>← Артка</button>
              )}
              {isCorrect ? (
                <button onClick={nextLevel} className={styles.nextBtn}>Кийинки тема ➜</button>
              ) : (
                <button onClick={checkAnswer} className={styles.checkBtn}>Текшерүү ➜</button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AICourse;