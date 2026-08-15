import  { useState, useEffect, useCallback,} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Trophy } from 'lucide-react';
import { auth } from '../../firebase';
import { addStudentXP } from '../../utils/studentAccount';
import { playCorrectSound, playWrongSound } from '../../utils/sounds';
import GameLeaderboard from '../../components/GameLeaderboard/GameLeaderboard';
import styles from './SnakeGame.module.css';

const GRID_SIZE = 15; // Телефонго ыңгайлуу болушу үчүн 15 кылдык
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

const questions = [
  { q: "9 × 6", a: 54, options: [54, 48, 63] },
  { q: "Кыргызстан эгемен качан болгон?", a: 1991, options: [1990, 1991, 1995] },
  { q: "150 + 250", a: 400, options: [350, 400, 450] },
  { q: "Манастын чоролору канча?", a: 40, options: [30, 40, 50] },
  { q: "7 × 8", a: 56, options: [54, 56, 64] },
];

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [foods, setFoods] = useState<{ x: number; y: number; val: number }[]>([]);
  const [xpAwarded, setXpAwarded] = useState(false);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setCurrentQ(0);
    setScore(0);
    setGameOver(false);
    setXpAwarded(false);
  };

  // Тамактарды (варианттарды) чачыратуу
  const generateFoods = useCallback(() => {
    const options = questions[currentQ].options;
    const newFoods = options.map(opt => ({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
      val: opt
    }));
    setFoods(newFoods);
  }, [currentQ]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    generateFoods();
  }, [generateFoods]);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake(prev => {
      const head = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };

      // Дубал же өзүн сүзүү
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE ||
          prev.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        playWrongSound();
        return prev;
      }

      const eatenFoodIndex = foods.findIndex(f => f.x === head.x && f.y === head.y);
      
      if (eatenFoodIndex !== -1) {
        const eatenValue = foods[eatenFoodIndex].val;
        if (eatenValue === questions[currentQ].a) {
          setScore(s => s + 10);
          playCorrectSound();
          if (currentQ < questions.length - 1) {
            setCurrentQ(q => q + 1);
          } else {
            setCurrentQ(0); // Суроолорду кайра баштоо
          }
          // Жылан узарат
          return [head, ...prev];
        } else {
          setGameOver(true); // Туура эмес жесе оюн бүтөт
          playWrongSound();
          return prev;
        }
      }

      return [head, ...prev.slice(0, -1)];
    });
  }, [direction, gameOver, foods, currentQ]);

  useEffect(() => {
    const interval = setInterval(moveSnake, 250);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    if (!gameOver || xpAwarded || score === 0) return;
    const user = auth.currentUser;
    if (user) {
      addStudentXP(user, score, 'snake_game').catch(() => undefined);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setXpAwarded(true);
  }, [gameOver, xpAwarded, score]);

  // Клавиатура башкаруу
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && direction.y === 0) setDirection({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && direction.y === 0) setDirection({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && direction.x === 0) setDirection({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && direction.x === 0) setDirection({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [direction]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.question}>{questions[currentQ].q} = ?</h2>
        <div className={styles.scoreBoard}>Упай: {score}</div>
      </div>

      <div className={styles.board}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const food = foods.find(f => f.x === x && f.y === y);

          return (
            <div key={i} className={styles.cell}>
              {isSnake && <motion.div layoutId="snake" className={styles.snakeBody} />}
              {food && <div className={styles.food}>{food.val}</div>}
            </div>
          );
        })}
        
        <AnimatePresence>
          {gameOver && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.overlay}>
              <Trophy size={32} color="#4ade80" />
              <h2>Оюн бүттү!</h2>
              <p>Упай: {score}</p>
              <button onClick={resetGame}>Кайра баштоо</button>
              <GameLeaderboard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Мобилдик башкаруу */}
      <div className={styles.joystick}>
        <button onClick={() => setDirection({ x: 0, y: -1 })} className={styles.up}><ArrowUp size={20} /></button>
        <div className={styles.mid}>
          <button onClick={() => setDirection({ x: -1, y: 0 })}><ArrowLeft size={20} /></button>
          <button onClick={() => setDirection({ x: 1, y: 0 })}><ArrowRight size={20} /></button>
        </div>
        <button onClick={() => setDirection({ x: 0, y: 1 })} className={styles.down}><ArrowDown size={20} /></button>
      </div>
    </div>
  );
};

export default SnakeGame;