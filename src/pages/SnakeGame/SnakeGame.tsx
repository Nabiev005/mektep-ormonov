import  { useState, useEffect, useCallback,} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        return prev;
      }

      const eatenFoodIndex = foods.findIndex(f => f.x === head.x && f.y === head.y);
      
      if (eatenFoodIndex !== -1) {
        const eatenValue = foods[eatenFoodIndex].val;
        if (eatenValue === questions[currentQ].a) {
          setScore(s => s + 10);
          if (currentQ < questions.length - 1) {
            setCurrentQ(q => q + 1);
          } else {
            setCurrentQ(0); // Суроолорду кайра баштоо
          }
          // Жылан узарат
          return [head, ...prev];
        } else {
          setGameOver(true); // Туура эмес жесе оюн бүтөт
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
              <h2>Оюн бүттү! 🍎</h2>
              <button onClick={() => window.location.reload()}>Кайра баштоо</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Мобилдик башкаруу */}
      <div className={styles.joystick}>
        <button onClick={() => setDirection({ x: 0, y: -1 })} className={styles.up}>▲</button>
        <div className={styles.mid}>
          <button onClick={() => setDirection({ x: -1, y: 0 })}>◀</button>
          <button onClick={() => setDirection({ x: 1, y: 0 })}>▶</button>
        </div>
        <button onClick={() => setDirection({ x: 0, y: 1 })} className={styles.down}>▼</button>
      </div>
    </div>
  );
};

export default SnakeGame;