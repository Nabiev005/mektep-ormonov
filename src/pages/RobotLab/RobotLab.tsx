import React, { useState, useRef, useEffect } from 'react';
import styles from './RobotLab.module.css';
import { robotLevels } from './levels'; // levels.ts файлын импорттоо

interface Position {
  x: number;
  y: number;
  rotation: number;
  status: 'idle' | 'moving' | 'success' | 'error';
}

const RobotLab: React.FC = () => {
  // Прогрессти сактоо (Level Index)
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = robotLevels[currentLevelIdx];

  const [code, setCode] = useState<string>(currentLevel.initialCode);
  const [robot, setRobot] = useState<Position>({ 
    x: 50, 
    y: 50, 
    rotation: 0, 
    status: 'idle' 
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  
  const robotRef = useRef(robot);
  robotRef.current = robot;

  // Деңгээл алмашқанда кодду жана роботту жаңылоо
  useEffect(() => {
    setCode(currentLevel.initialCode);
    resetRobot();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevelIdx]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`].slice(-5));
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // --- API ---
  const moveForward = async (steps: number) => {
    setRobot(prev => ({ ...prev, status: 'moving' }));
    for (let i = 0; i < steps; i++) {
      await sleep(200);
      setRobot(prev => ({
        ...prev,
        x: prev.x + Math.cos((prev.rotation * Math.PI) / 180) * 25,
        y: prev.y + Math.sin((prev.rotation * Math.PI) / 180) * 25,
      }));
    }
    setRobot(prev => ({ ...prev, status: 'idle' }));
  };

  const turn = async (angle: number) => {
    setRobot(prev => ({ ...prev, status: 'moving' }));
    await sleep(300);
    setRobot(prev => ({ ...prev, rotation: prev.rotation + angle }));
    setRobot(prev => ({ ...prev, status: 'idle' }));
  };

  const scanDistance = () => {
    const dist = Math.sqrt(
      Math.pow(currentLevel.targetPos.x - robotRef.current.x, 2) + 
      Math.pow(currentLevel.targetPos.y - robotRef.current.y, 2)
    );
    return Math.round(dist / 10);
  };

  const resetRobot = () => {
    setRobot({ x: 50, y: 50, rotation: 0, status: 'idle' });
    setLogs([`🔄 Деңгээл ${currentLevel.id} жүктөлдү.`]);
  };

  const runCode = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setLogs(["⚡ Система иштеп жатат..."]);
    
    try {
      const api = {
        move: async (s: number) => await moveForward(s),
        right: async () => await turn(90),
        left: async () => await turn(-90),
        scan: () => scanDistance(),
        log: (m: string) => addLog(m)
      };

      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const execute = new AsyncFunction('robot', `try { ${code} } catch(e) { robot.log(e.message) }`);
      
      await execute(api);
      
      const finalDist = scanDistance();
      if (finalDist < 5) {
        addLog("🏆 КЕРЕМЕТ! Сабак аяктады.");
        setRobot(prev => ({ ...prev, status: 'success' }));
      } else {
        addLog("📍 Максатка жетпедиңиз. Кодду кайра текшериңиз.");
        setRobot(prev => ({ ...prev, status: 'error' }));
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      addLog(`❌ Ката: ${err.message}`);
      setRobot(prev => ({ ...prev, status: 'error' }));
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.levelBadge}>{currentLevel.category} | Level {currentLevel.id} / 40</div>
        <h1>ОРМОНОВ РОБОТОТЕХНИКАСЫ</h1>
      </header>

      <div className={styles.mainLayout}>
        {/* СОЛ ТАРАП: ТЕОРИЯ ЖАНА ТАПШЫРМА */}
        <aside className={styles.sidebar}>
          <div className={styles.lessonCard}>
            <h2>{currentLevel.title}</h2>
            <div className={styles.theoryBox}>
              <p>{currentLevel.theory}</p>
            </div>
            <div className={styles.taskBox}>
              <strong>Тапшырма:</strong>
              <p>{currentLevel.task}</p>
            </div>
          </div>
          
          <div className={styles.levelNav}>
            <button 
              disabled={currentLevelIdx === 0}
              onClick={() => setCurrentLevelIdx(prev => prev - 1)}
            >◀ Артка</button>
            <span>{currentLevelIdx + 1} / 40</span>
            <button 
              disabled={currentLevelIdx === robotLevels.length - 1}
              onClick={() => setCurrentLevelIdx(prev => prev + 1)}
            >Кийинки ▶</button>
          </div>
        </aside>

        {/* ОРТО: ОЮН ТАЛААСЫ */}
        <main className={styles.gameContainer}>
          <div className={styles.scene}>
            <div 
              className={`${styles.robotWrapper} ${styles[robot.status]}`}
              style={{ 
                left: `${robot.x}px`, 
                top: `${robot.y}px`,
                transform: `rotate(${robot.rotation}deg)`
              }}
            >
              <div className={styles.robotBody}>
                <div className={styles.eyeScanner}></div>
                <div className={styles.coreReactor}></div>
              </div>
            </div>

            <div className={styles.targetZone} style={{ left: currentLevel.targetPos.x, top: currentLevel.targetPos.y }}>
              <div className={styles.targetPulse}></div>
              🏁
            </div>
          </div>
          <div className={styles.terminal}>
            {logs.map((log, i) => <div key={i} className={styles.logLine}>{log}</div>)}
          </div>
        </main>

        {/* ОҢ ТАРАП: КОД РЕДАКТОРУ */}
        <section className={styles.editorContainer}>
          <div className={styles.editorHeader}>brain_module.js</div>
          <textarea 
            className={styles.codeArea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
          <div className={styles.controls}>
            <button className={styles.runBtn} onClick={runCode} disabled={isExecuting}>
              {isExecuting ? "ЖҮКТӨЛҮҮДӨ..." : "КОДДУ ИШТЕТҮҮ"}
            </button>
            <button className={styles.resetBtn} onClick={resetRobot}>🔄</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RobotLab;