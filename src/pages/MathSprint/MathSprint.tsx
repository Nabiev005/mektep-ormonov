import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Calculator, Clock3, Medal, Play, Sparkles, Target, Trophy, UserRound, Zap } from 'lucide-react';
import styles from './MathSprint.module.css';

interface Leader {
  name: string;
  score: number;
}

const MathSprint = () => {
  const [playerName, setPlayerName] = useState(''); // Окуучунун аты
  const [isLogged, setIsLogged] = useState(false); // Атын жаздыбы?
  const [problem, setProblem] = useState({ q: '', a: 0, options: [] as number[] });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // 1. Маалыматтарды жүктөө
  useEffect(() => {
    const savedScore = localStorage.getItem('math_sprint_highscore');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedScore) setHighScore(parseInt(savedScore));

    const savedLeaders = localStorage.getItem('math_sprint_leaders');
    if (savedLeaders) setLeaders(JSON.parse(savedLeaders));
  }, []);

  const generateProblem = useCallback(() => {
    const operators = ['+', '-', '×'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let n1, n2, answer;

    if (op === '×') {
      n1 = Math.floor(Math.random() * 8) + 2;
      n2 = Math.floor(Math.random() * 9) + 2;
      answer = n1 * n2;
    } else {
      n1 = Math.floor(Math.random() * 50) + 1;
      n2 = Math.floor(Math.random() * 50) + 1;
      answer = op === '+' ? n1 + n2 : n1 - n2;
    }

    const opts = new Set([answer]);
    while(opts.size < 3) {
      opts.add(answer + (Math.floor(Math.random() * 10) - 5));
    }
    setProblem({ 
      q: `${n1} ${op === '×' ? '×' : op} ${n2}`, 
      a: answer, 
      options: Array.from(opts).sort(() => Math.random() - 0.5) 
    });
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setIsActive(true);
    setIsGameOver(false);
    generateProblem();
  };

  const finishGame = useCallback(() => {
    setIsActive(false);
    setIsGameOver(true);

    // Рейтингди жаңылоо (автоматтык түрдө playerName колдонулат)
    const newRecord = { name: playerName, score: score };
    const updatedLeaders = [...leaders, newRecord]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setLeaders(updatedLeaders);
    localStorage.setItem('math_sprint_leaders', JSON.stringify(updatedLeaders));

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('math_sprint_highscore', score.toString());
    }
  }, [score, leaders, highScore, playerName]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      finishGame();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, finishGame]);

  const handleAnswer = (choice: number) => {
    if (choice === problem.a) {
      setScore(prev => prev + 10);
      setTimeLeft(prev => Math.min(prev + 2, 20));
      generateProblem();
    } else {
      setTimeLeft(prev => Math.max(0, prev - 3));
      generateProblem();
    }
  };

  // Атын жазуу формасын текшерүү
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim().length > 2) {
      setIsLogged(true);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidePanel}>
        <div className={styles.panelTitle}><Trophy size={20} /> ТОП 3 Мыкты</div>
        {leaders.length > 0 ? leaders.map((leader, index) => (
          <div key={index} className={styles.leaderItem}>
            <span>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} {leader.name}</span> 
            <span className={styles.leaderScore}>{leader.score}</span>
          </div>
        )) : <p>Азырынча рекорд жок</p>}
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.card}>
          
          <AnimatePresence mode="wait">
            {!isLogged ? (
              // КИРҮҮ ЭКРАНЫ
              <motion.form 
                key="login"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                onSubmit={handleLogin}
                className={styles.loginForm}
              >
                <span className={styles.eyebrow}>
                  <Calculator size={18} />
                  Математикалык спринт
                </span>
                <h1>Тез эсепте</h1>
                <p>
                  15 секунд ичинде мүмкүн болушунча көп мисал чыгарыңыз.
                  Туура жооп +10 упай жана +2 секунд, ката жооп -3 секунд.
                </p>
                <div className={styles.rulesGrid}>
                  <span><Clock3 size={17} /> 15 секунд</span>
                  <span><Zap size={17} /> Ылдамдык</span>
                  <span><Target size={17} /> Так жооп</span>
                </div>
                <label className={styles.nameBox}>
                  <UserRound size={20} />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Атыңыз..." 
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className={styles.nameInput}
                    required
                  />
                </label>
                <button type="submit" className={styles.mainBtn}><Play size={18} /> Кирүү</button>
              </motion.form>
            ) : !isActive && !isGameOver ? (
              // БАШТОО ЭКРАНЫ
              <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.startScreen}>
                <div className={styles.highScoreLabel}><Medal size={16} /> Рекорд: {highScore}</div>
                <div className={styles.bigIcon}><Brain size={58} /></div>
                <h1>Даярсыңбы, {playerName}?</h1>
                <p>Мисал чыккандан кийин туура жоопту тез тандаңыз.</p>
                <button onClick={startGame} className={styles.mainBtn}><Zap size={18} /> Баштадык!</button>
              </motion.div>
            ) : isGameOver ? (
              // ОЮН БҮТТҮ
              <div className={styles.endWrap}>
                <h2>Оюн бүттү!</h2>
                <div className={styles.finalScore}>{score}</div>
                <p>{playerName}, упайың сакталды!</p>
                <button onClick={startGame} className={styles.mainBtn}>Кайра аракет</button>
              </div>
            ) : (
              // ОЮН ПРОЦЕССИ
              <div className={styles.gameWrap}>
                <div className={styles.gameStats}>
                  <div className={styles.statBox}><Clock3 size={18} /> {timeLeft}с</div>
                  <div className={styles.statBox}><Sparkles size={18} /> {score}</div>
                </div>
                <div className={styles.progressBg}>
                  <motion.div animate={{ width: `${(timeLeft / 20) * 100}%` }} className={styles.progressBar} />
                </div>
                <div className={styles.question}>{problem.q} = ?</div>
                <div className={styles.optionsGrid}>
                  {problem.options.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)} className={styles.optBtn}>{opt}</button>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <aside className={styles.sidePanel}>
        <div className={styles.panelTitle}><UserRound size={20} /> Катышуучу</div>
        {isLogged ? (
          <div className={styles.userInfo}>
            <p><strong>Аты:</strong> {playerName}</p>
            <p><strong>Жеке рекорд:</strong> {highScore}</p>
          </div>
        ) : <p>Кирүү күтүлүүдө...</p>}
      </aside>
    </div>
  );
};

export default MathSprint;
