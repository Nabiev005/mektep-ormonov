import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import Formula from './Formula';
import styles from './Physics.module.css';

const GRAVITY_PRESETS = [
  { label: 'Жер', value: 9.8 },
  { label: 'Ай', value: 1.62 },
  { label: 'Марс', value: 3.71 },
];

const MAX_LENGTH = 2.5;

const PendulumSim = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ theta: 0.6, omega: 0, lastTime: 0 });
  const traceRef = useRef<{ x: number; y: number }[]>([]);
  const runningRef = useRef(false);

  const [length, setLength] = useState(1.6);
  const [gravity, setGravity] = useState(9.8);
  const [initialAngle, setInitialAngle] = useState(35);
  const [running, setRunning] = useState(false);
  const [display, setDisplay] = useState({ theta: (35 * Math.PI) / 180, omega: 0 });

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    stateRef.current = { theta: (initialAngle * Math.PI) / 180, omega: 0, lastTime: 0 };
    traceRef.current = [];
    setDisplay({ theta: stateRef.current.theta, omega: 0 });
    setRunning(false);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx2d = canvas.getContext('2d');
    let frameId: number;
    let pxPerMeter = 80;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx2d?.setTransform(ratio, 0, 0, ratio, 0, 0);
      pxPerMeter = (rect.height * 0.55) / MAX_LENGTH;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);
      if (!ctx2d) return;

      if (runningRef.current) {
        let dt = stateRef.current.lastTime ? (time - stateRef.current.lastTime) / 1000 : 0;
        stateRef.current.lastTime = time;
        dt = Math.min(dt, 0.05);
        const subSteps = 6;
        const h = dt / subSteps;
        for (let i = 0; i < subSteps; i++) {
          const accel = -(gravity / length) * Math.sin(stateRef.current.theta) - 0.15 * stateRef.current.omega;
          stateRef.current.omega += accel * h;
          stateRef.current.theta += stateRef.current.omega * h;
        }
      } else {
        stateRef.current.lastTime = 0;
      }

      const rect = container.getBoundingClientRect();
      ctx2d.clearRect(0, 0, rect.width, rect.height);

      const px = rect.width / 2;
      const py = rect.height * 0.12;
      const bobX = px + Math.sin(stateRef.current.theta) * length * pxPerMeter;
      const bobY = py + Math.cos(stateRef.current.theta) * length * pxPerMeter;

      if (runningRef.current) {
        traceRef.current.push({ x: bobX, y: bobY });
        if (traceRef.current.length > 150) traceRef.current.shift();
      }

      ctx2d.beginPath();
      traceRef.current.forEach((pt, i) => (i === 0 ? ctx2d.moveTo(pt.x, pt.y) : ctx2d.lineTo(pt.x, pt.y)));
      ctx2d.strokeStyle = 'rgba(37,99,235,0.25)';
      ctx2d.lineWidth = 2;
      ctx2d.stroke();

      ctx2d.beginPath();
      ctx2d.moveTo(px, py);
      ctx2d.lineTo(bobX, bobY);
      ctx2d.strokeStyle = '#475569';
      ctx2d.lineWidth = 3;
      ctx2d.stroke();

      ctx2d.fillStyle = '#0f172a';
      ctx2d.beginPath();
      ctx2d.arc(px, py, 5, 0, Math.PI * 2);
      ctx2d.fill();

      const grad = ctx2d.createRadialGradient(bobX - 5, bobY - 5, 2, bobX, bobY, 16);
      grad.addColorStop(0, '#60a5fa');
      grad.addColorStop(1, '#1d4ed8');
      ctx2d.beginPath();
      ctx2d.arc(bobX, bobY, 16, 0, Math.PI * 2);
      ctx2d.fillStyle = grad;
      ctx2d.fill();
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [length, gravity, initialAngle]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setDisplay({ theta: stateRef.current.theta, omega: stateRef.current.omega });
    }, 150);
    return () => clearInterval(id);
  }, [running]);

  const handleReset = () => {
    stateRef.current = { theta: (initialAngle * Math.PI) / 180, omega: 0, lastTime: 0 };
    traceRef.current = [];
    setDisplay({ theta: stateRef.current.theta, omega: 0 });
    setRunning(false);
  };

  const period = 2 * Math.PI * Math.sqrt(length / gravity);

  return (
    <div className={styles.simWrapper}>
      <div className={styles.simToolbar}>
        <div className={styles.group}>
          <button className={styles.playBtn} onClick={() => setRunning((r) => !r)} type="button">
            {running ? <Pause size={16} /> : <Play size={16} />} {running ? 'Тыныгуу' : 'Баштоо'}
          </button>
          <button className={styles.toggleBtn} onClick={handleReset} type="button">
            <RotateCcw size={16} /> Баштапкы абалга
          </button>
        </div>
        <div className={styles.group}>
          {GRAVITY_PRESETS.map((g) => (
            <button
              key={g.label}
              className={`${styles.toggleBtn} ${gravity === g.value ? styles.toggleActive : ''}`}
              onClick={() => setGravity(g.value)}
              type="button"
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.paramsRow}>
        <div className={styles.paramItem}>
          <label>Жиптин узундугу (L): {length.toFixed(1)} м</label>
          <input type="range" min={0.5} max={MAX_LENGTH} step={0.1} value={length} onChange={(e) => setLength(Number(e.target.value))} />
        </div>
        <div className={styles.paramItem}>
          <label>Баштапкы бурч: {initialAngle}°</label>
          <input type="range" min={5} max={80} step={1} value={initialAngle} onChange={(e) => setInitialAngle(Number(e.target.value))} />
        </div>
      </div>

      <div className={styles.canvasArea} ref={containerRef}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <div className={styles.readouts}>
        <div className={styles.readoutCard}>
          <span className={styles.readoutTag}>Термелүү мезгили</span>
          <Formula tex={'T = 2\\pi\\sqrt{\\dfrac{L}{g}}'} />
          <span className={styles.readoutValue}>T ≈ {period.toFixed(2)} с</span>
        </div>
        <div className={styles.readoutCard}>
          <span className={styles.readoutTag}>Учурдагы бурч</span>
          <span className={styles.readoutValue}>{((display.theta * 180) / Math.PI).toFixed(1)}°</span>
        </div>
        <div className={styles.readoutCard}>
          <span className={styles.readoutTag}>Бурчтук ылдамдык</span>
          <span className={styles.readoutValue}>{display.omega.toFixed(2)} рад/с</span>
        </div>
      </div>
    </div>
  );
};

export default PendulumSim;
