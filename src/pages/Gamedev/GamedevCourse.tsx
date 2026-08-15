import React, { useEffect, useState } from 'react';
import { gamedevLevels } from './gamedevLevels';
import styles from './GamedevCourse.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Joystick, List, Play, Rocket, Sparkles, Swords, Trophy, X } from 'lucide-react';
import { auth } from '../../firebase';
import { recordStudentCourseProgress } from '../../utils/studentAccount';

const GamedevCourse: React.FC = () => {
  const [courseStarted, setCourseStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const level = gamedevLevels[currentLevel];
  const progressPercent = ((currentLevel + 1) / gamedevLevels.length) * 100;
  const completedLevels = Math.min(gamedevLevels.length, currentLevel + (isCorrect || isFinished ? 1 : 0));
  const savedProgressPercent = Math.round((completedLevels / gamedevLevels.length) * 100);

  useEffect(() => {
    recordStudentCourseProgress(auth.currentUser, {
      source: 'gamedev_course',
      title: 'Оюн түзүү',
      progressPercent: savedProgressPercent,
      completed: completedLevels,
      total: gamedevLevels.length,
      score: completedLevels,
    }).catch(() => undefined);
  }, [completedLevels, savedProgressPercent]);

  const handleCheck = () => {
    if (userInput.trim().toLowerCase() === level.correctAnswer.toLowerCase()) {
      setIsCorrect(true);
      setOutput(`>>> SUCCESS: ${level.correctAnswer} кабыл алынды!`);
    } else {
      setOutput('>>> ERROR: Коддо ката бар, кайра аракет кыл!');
    }
  };

  const nextStep = () => {
    if (currentLevel < gamedevLevels.length - 1) {
      goToLevel(currentLevel + 1);
    } else {
      setIsFinished(true);
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
    setShowMenu(false);
  };

  if (isFinished) {
    return (
      <div className={styles.finishContainer}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={styles.finishCard}>
          <Trophy size={48} />
          <h1>🏆 Керемет!</h1>
          <p>Сиз "Оюн түзүү" курсун ийгиликтүү аяктадыңыз.</p>
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
          className={styles.hero}
        >
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>
              <Gamepad2 size={18} />
              Gamedev IT курсу
            </span>
            <h1>Оюн түзүүнүн негиздери</h1>
            <p>
              Оюн логикасы кандай иштейт? Координаттар, коллизия, эсептегичтер жана оюнчунун абалы —
              бул курста код жазып, реалдуу оюн түзүүчүлөрдүн ой жүгүртүүсүн үйрөнөсүз.
            </p>
            <button className={styles.startBtn} onClick={() => setCourseStarted(true)} type="button">
              <Play size={18} />
              Курсту баштоо
            </button>
          </div>

          <div className={styles.heroStats}>
            <div>
              <Joystick size={23} />
              <strong>{gamedevLevels.length}</strong>
              <span>практикалык деңгээл</span>
            </div>
            <div>
              <Rocket size={23} />
              <strong>Код</strong>
              <span>жазып үйрөнүү</span>
            </div>
          </div>
        </motion.section>

        <section className={styles.roadmap}>
          <article>
            <Sparkles size={22} />
            <h3>Gamedev эмне үчүн керек?</h3>
            <p>Ар бир видео оюн, мобилдик апп жана симуляция артында программалык логика жатат.</p>
          </article>
          <article>
            <Swords size={22} />
            <h3>Эмнеден баштайбыз?</h3>
            <p>Координаттар системасынан, каармандын жылышынан жана негизги оюн циклинен баштайбыз.</p>
          </article>
        </section>

        <div className={styles.coursePreview}>
          <div>
            <Trophy size={24} />
            <strong>Максат</strong>
            <span>Оюн логикасынын негиздерин түшүнүп, өз алдынча код жаза алуу.</span>
          </div>
          <button className={styles.secondaryStartBtn} onClick={() => setCourseStarted(true)} type="button">
            Биринчи деңгээлге өтүү
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
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
              <button onClick={() => setShowMenu(false)}><X size={18} /></button>
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
        <div className={styles.progressWrapper}>
          <div className={styles.progressInfo}>
            <button onClick={() => setShowMenu(true)} className={styles.menuBtn}><List size={16} /> Темалар</button>
            <span>{level.id} / {gamedevLevels.length} · {Math.round(progressPercent)}%</span>
          </div>
          <div className={styles.progressBar}>
            <motion.div className={styles.progressFill} animate={{ width: `${progressPercent}%` }} />
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
            <h2 className={styles.title}>🎮 {level.title}</h2>

            <div className={styles.theoryCard}>
              <span className={styles.label}>[ ТЕОРИЯ ]</span>
              <p>{level.theory}</p>
            </div>

            <p className={styles.description}>{level.description}</p>

            <div className={`${styles.editor} ${isCorrect ? styles.correctGlow : ''}`}>
              <div className={styles.editorHeader}>
                <div className={styles.dots}><span/><span/><span/></div>
                <span className={styles.fileName}>game_logic.js</span>
              </div>
              <div className={styles.codeArea}>
                <pre className={styles.pre}>
                  <code>
                    {level.codeExample.split('____')[0]}
                    <input
                      className={styles.inlineInput}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="..."
                      disabled={isCorrect}
                      autoFocus
                    />
                    {level.codeExample.split('____')[1]}
                  </code>
                </pre>
              </div>
            </div>

            <div className={styles.terminal}>
              <div className={styles.terminalHeader}>Output (Натыйжа)</div>
              <div className={styles.terminalBody} style={{ color: isCorrect ? '#10b981' : '#f87171' }}>
                {output || '>>> Кодду күтүүдө...'}
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button onClick={prevStep} className={styles.prevBtn} disabled={currentLevel === 0}>
                ← Артка
              </button>
              {isCorrect ? (
                <button onClick={nextStep} className={styles.nextBtn}>Кийинки кадам ➜</button>
              ) : (
                <button onClick={handleCheck} className={styles.checkBtn}>Текшерүү ➜</button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GamedevCourse;
