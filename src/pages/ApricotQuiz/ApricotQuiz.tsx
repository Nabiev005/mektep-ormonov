import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ApricotQuiz.module.css';

// СУРООЛОР БАЗАСЫ (Буга каалаганча суроо кошсоңуз болот)
const allQuestions = [
  { id: 1, q: "Кыргызстандын эң бийик чокусу кайсы?", a: "Жеңиш чокусу", options: ["Ленин", "Жеңиш чокусу", "Хан-Теңири"] },
  { id: 2, q: "Баткендин символу болгон гүл?", a: "Айгүл гүлү", options: ["Жоогазын", "Айгүл гүлү", "Роза"] },
  { id: 3, q: "Манастын атасынын аты ким?", a: "Жакып", options: ["Бакай", "Жакып", "Кошой"] },
  { id: 4, q: "Кыргыз алфавитинде канча тамга бар?", a: "36", options: ["32", "36", "38"] },
  { id: 5, q: "Дүйнөдөгү эң чоң жаңгак токою кайсы жерде?", a: "Арсланбаб", options: ["Арсланбаб", "Сары-Челек", "Алай"] },
  { id: 6, q: "Кыргызстандын борбору Бишкек кайсы жылы негизделген?", a: "1878", options: ["1878", "1924", "1825"] },
  { id: 7, q: "Ысык-Көлдүн тереңдиги канча метр?", a: "668", options: ["500", "668", "702"] },
  { id: 8, q: "Чыңгыз Айтматовдун эң биринчи чыгармасы?", a: "Ашым", options: ["Жамиля", "Ашым", "Бетме-бет"] },
  { id: 9, q: "Кыргызстандын туусу качан кабыл алынган?", a: "1992-жыл 3-март", options: ["1991-жыл 31-август", "1992-жыл 3-март", "1993-жыл 10-май"] },
  { id: 10, q: "Дүйнөдөгү эң узун дастан кайсы?", a: "Манас", options: ["Махабхарата", "Манас", "Одиссея"] },
  { id: 11, q: "Баткен облусу качан түзүлгөн?", a: "1999-жыл", options: ["1991-жыл", "1999-жыл", "2001-жыл"] },
  { id: 12, q: "Кыргызстандагы эң чоң суу сактагыч?", a: "Токтогул", options: ["Орто-Токой", "Токтогул", "Киров"] },
];

const ApricotQuiz = () => {
  // Суроолорду аралаштыруу үчүн өзүнчө state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [health, setHealth] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [fallingLeaves, setFallingLeaves] = useState<{ id: number; left: string }[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // ОЮН БАШТАЛГАНДА СУРООЛОРДУ АРАЛАШТЫРУУ
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shuffle = (array: any[]) => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr.slice(0, 7); // Ар бир оюнда 12 суроонун ичинен 7син гана тандап алат
    };

    setShuffledQuestions(shuffle(allQuestions));

    const saved = localStorage.getItem('apricot_high_score');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (fallingLeaves.length > 0) {
      const timer = setTimeout(() => {
        setFallingLeaves(prev => prev.slice(5));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fallingLeaves]);

  const handleAnswer = (selected: string) => {
    if (!shuffledQuestions[currentStep]) return;
    
    setSelectedOption(selected);

    if (selected === shuffledQuestions[currentStep].a) {
      setHealth(prev => Math.min(prev + 10, 100));
      setScore(prev => prev + 20);
      setFeedback('correct');
    } else {
      setHealth(prev => Math.max(prev - 20, 0));
      setFeedback('wrong');
      const newLeaves = Array.from({ length: 5 }).map((_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 80 + 10 + "%"
      }));
      setFallingLeaves(prev => [...prev, ...newLeaves]);
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);

      if (currentStep < shuffledQuestions.length - 1 && health > 20) {
        setCurrentStep(prev => prev + 1);
      } else {
        finishGame();
      }
    }, 800);
  };

  const finishGame = () => {
    setIsFinished(true);
    const finalScore = score + (health > 0 ? health : 0);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('apricot_high_score', finalScore.toString());
      setShowConfetti(true);
    }
  };

  // Эгер суроолор али жүктөлө элек болсо (аралашып жатса)
  if (shuffledQuestions.length === 0) return <div>Жүктөлүүдө...</div>;

  return (
    <div className={styles.container}>
      {/* ... (Confetti жана StatsBar бөлүгү мурунку бойдон калат) */}
      <AnimatePresence>
        {showConfetti && (
          <div className={styles.confettiOverlay}>
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                // eslint-disable-next-line react-hooks/purity
                initial={{ y: -20, x: Math.random() * 100 + "%", opacity: 1 }}
                animate={{ y: "100vh", rotate: 720 }}
                transition={{ duration: 3, ease: "linear" }}
                className={styles.confettiPiece}
                style={{ backgroundColor: ['#ff0', '#f0f', '#0ff', '#0f0'][i % 4] }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className={styles.statsBar}>
         <div className={styles.statItem}>🏆 Рекорд: {highScore}</div>
         <div className={styles.statItem}>⭐ Упай: {score}</div>
      </div>

      <motion.h1 initial={{ y: -50 }} animate={{ y: 0 }} className={styles.title}>
        Өрүк Дарагын Сакта! 🌳
      </motion.h1>

      <div className={styles.gameBox}>
        {/* ДАРАК СЕКЦИЯСЫ (Мурунку реалдуу анимациялар менен) */}
        <div className={styles.treeSection}>
          <div className={styles.healthBar}>
            <motion.div 
              animate={{ width: `${health}%` }}
              className={styles.healthProgress} 
              style={{ backgroundColor: health < 35 ? '#ef4444' : health < 70 ? '#f59e0b' : '#22c55e' }}
            />
          </div>
          <div className={styles.treeContainer}>
            <AnimatePresence>
              {fallingLeaves.map(leaf => (
                <motion.span
                  key={leaf.id}
                  initial={{ y: 0, x: 0, opacity: 1 }}
                  animate={{ y: 350, x: [0, -20, 20, -10, 0], opacity: 0, rotate: 720 }}
                  transition={{ duration: 2.5 }}
                  className={styles.leaf}
                  style={{ left: leaf.left }}
                >
                  🍃
                </motion.span>
              ))}
            </AnimatePresence>
            <motion.div 
              animate={{ 
                scale: feedback === 'correct' ? [1, 1.1, 1] : 1,
                filter: `grayscale(${100 - health}%) sepia(${(100 - health) / 2}%)`
              }}
              className={styles.treeVisual}
            >
              {health > 80 ? '🌳🌸' : health > 40 ? '🌳' : health > 0 ? '🍂' : '🪵'}
            </motion.div>
          </div>
        </div>

        {/* ТЕСТ СЕКЦИЯСЫ */}
        {!isFinished && health > 0 ? (
          <motion.div key={currentStep} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={styles.quizSection}>
            <p className={styles.questionNum}>Суроо {currentStep + 1} / {shuffledQuestions.length}</p>
            <h2 className={styles.questionText}>{shuffledQuestions[currentStep].q}</h2>
            <div className={styles.optionsGrid}>
              {shuffledQuestions[currentStep].options.map((option: string) => (
                <button 
                  key={option} 
                  onClick={() => handleAnswer(option)} 
                  disabled={feedback !== null}
                  className={`${styles.optionBtn} ${
                    feedback === 'correct' && option === shuffledQuestions[currentStep].a ? styles.correctBtn : 
                    feedback === 'wrong' && option === selectedOption ? styles.wrongBtn : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={styles.results}>
             <span className={styles.resultIcon}>{health > 0 ? "🥇" : "🥀"}</span>
             <h2>{health > 0 ? "Сиз чыныгы багбансыз!" : "Оюн бүттү"}</h2>
             <div className={styles.finalScoreCard}>
                <p>Жалпы упай: <strong>{score + health}</strong></p>
                {score + health >= highScore && highScore !== 0 && <p className={styles.newRecord}>Жаңы рекорд! 🎉</p>}
             </div>
             <button onClick={() => window.location.reload()} className={styles.restartBtn}>Кайра баштоо</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ApricotQuiz;