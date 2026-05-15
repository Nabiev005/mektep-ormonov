import React, { useEffect, useState } from 'react';
import { aiLevels } from './aiLevels';
import styles from './AICourse.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, BrainCircuit, Database, MessageSquareText, Play, Rocket, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { auth } from '../../firebase';
import { recordStudentCourseProgress } from '../../utils/studentAccount';

const AICourse: React.FC = () => {
  const [courseStarted, setCourseStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const level = aiLevels[currentLevel];
  const progressPercent = ((currentLevel + 1) / aiLevels.length) * 100;
  const completedLevels = Math.min(aiLevels.length, currentLevel + (isCorrect || isFinished ? 1 : 0));
  const savedProgressPercent = Math.round((completedLevels / aiLevels.length) * 100);

  useEffect(() => {
    recordStudentCourseProgress(auth.currentUser, {
      source: 'ai_course',
      title: 'AI үйрөнүү',
      progressPercent: savedProgressPercent,
      completed: completedLevels,
      total: aiLevels.length,
      score: completedLevels,
    }).catch(() => undefined);
  }, [completedLevels, savedProgressPercent]);

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

  if (!courseStarted) {
    return (
      <div className={styles.landing}>
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.aiHero}
        >
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>
              <Bot size={18} />
              AI үйрөнүү курсу
            </span>
            <h1>Жасалма интеллектти түшүнүп колдонуу</h1>
            <p>
              Бул бөлүмдө окуучу AI эмне экенин, prompt кантип жазыларын,
              маалымат, модель, output жана жоопкерчиликтүү колдонуу негиздерин практика аркылуу үйрөнөт.
            </p>
            <button className={styles.startBtn} onClick={() => setCourseStarted(true)} type="button">
              <Play size={18} />
              Курсту баштоо
            </button>
          </div>

          <div className={styles.heroStats}>
            <div>
              <BrainCircuit size={23} />
              <strong>{aiLevels.length}</strong>
              <span>AI темасы</span>
            </div>
            <div>
              <Rocket size={23} />
              <strong>Практика</strong>
              <span>суроо-жооп аркылуу</span>
            </div>
          </div>
        </motion.section>

        <section className={styles.roadmap}>
          <article>
            <Sparkles size={22} />
            <h3>AI деген эмне?</h3>
            <p>
              AI - компьютердин маалыматтан үйрөнүп, суроого жооп берип,
              божомол жасап же текст/сүрөт түзө алган системасы.
            </p>
          </article>
          <article>
            <MessageSquareText size={22} />
            <h3>Prompt жазуу</h3>
            <p>
              Жакшы prompt так, контексттүү жана максаты белгилүү болот.
              Окуучу AIдан сапаттуу жооп алууну үйрөнөт.
            </p>
          </article>
          <article>
            <Database size={22} />
            <h3>Data жана Model</h3>
            <p>
              AI маалыматка таянып иштейт. Модель, input, output жана prediction түшүнүктөрү жөнөкөй тилде берилет.
            </p>
          </article>
          <article>
            <ShieldCheck size={22} />
            <h3>Коопсуз колдонуу</h3>
            <p>
              AI жаңылышы мүмкүн. Ошондуктан жоопту текшерүү, жеке маалыматты коргоо жана этика маанилүү.
            </p>
          </article>
        </section>

        <div className={styles.coursePreview}>
          <div>
            <Trophy size={24} />
            <strong>Максат</strong>
            <span>AI куралдарын түшүнүп, туура суроо берип, жыйынтыкты сын көз менен текшерүү.</span>
          </div>
          <button className={styles.secondaryStartBtn} onClick={() => setCourseStarted(true)} type="button">
            Биринчи темага өтүү
          </button>
        </div>
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
