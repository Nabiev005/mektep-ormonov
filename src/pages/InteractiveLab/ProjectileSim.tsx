import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import Formula from './Formula';
import styles from './Physics.module.css';

const GRAVITY_PRESETS = [
  { label: 'Жер', value: 9.8 },
  { label: 'Ай', value: 1.62 },
  { label: 'Марс', value: 3.71 },
];

const ProjectileSim = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ t: 0, lastTime: 0 });
  const traceRef = useRef<{ x: number; y: number }[]>([]);
  const runningRef = useRef(false);

  const [angle, setAngle] = useState(45);
  const [speed, setSpeed] = useState(18);
  const [gravity, setGravity] = useState(9.8);
  const [running, setRunning] = useState(false);
  const [display, setDisplay] = useState({ t: 0 });

  const angleRad = (angle * Math.PI) / 180;
  const flightTime = (2 * speed * Math.sin(angleRad)) / gravity;
  const range = (speed ** 2 * Math.sin(2 * angleRad)) / gravity;
  const maxHeight = (speed * Math.sin(angleRad)) ** 2 / (2 * gravity);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    stateRef.current = { t: 0, lastTime: 0 };
    traceRef.current = [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplay({ t: 0 });
    setRunning(false);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx2d = canvas.getContext('2d');
    let frameId: number;
    let pxPerMeter = 20;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx2d?.setTransform(ratio, 0, 0, ratio, 0, 0);
      const maxX = Math.max(range, 5);
      const maxY = Math.max(maxHeight, 2);
      pxPerMeter = Math.min((rect.width * 0.82) / maxX, (rect.height * 0.7) / maxY);
    };
    resize();
    window.addEventListener('resize', resize);

    const posAt = (t: number, rect: DOMRect) => {
      const x = speed * Math.cos(angleRad) * t;
      const y = speed * Math.sin(angleRad) * t - 0.5 * gravity * t * t;
      const gY = rect.height * 0.85;
      const oX = rect.width * 0.06;
      return { px: oX + x * pxPerMeter, py: gY - y * pxPerMeter };
    };

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);
      if (!ctx2d) return;

      if (runningRef.current && stateRef.current.t < flightTime) {
        const dt = stateRef.current.lastTime ? (time - stateRef.current.lastTime) / 1000 : 0;
        stateRef.current.lastTime = time;
        stateRef.current.t = Math.min(stateRef.current.t + dt, flightTime);
      } else if (runningRef.current) {
        stateRef.current.lastTime = time;
      } else {
        stateRef.current.lastTime = 0;
      }

      const rect = container.getBoundingClientRect();
      ctx2d.clearRect(0, 0, rect.width, rect.height);

      const gY = rect.height * 0.85;
      ctx2d.strokeStyle = 'rgba(100,116,139,0.4)';
      ctx2d.beginPath();
      ctx2d.moveTo(0, gY);
      ctx2d.lineTo(rect.width, gY);
      ctx2d.stroke();

      ctx2d.beginPath();
      for (let i = 0; i <= 60; i++) {
        const tt = (flightTime * i) / 60;
        const { px, py } = posAt(tt, rect);
        if (i === 0) ctx2d.moveTo(px, py);
        else ctx2d.lineTo(px, py);
      }
      ctx2d.strokeStyle = 'rgba(148,163,184,0.55)';
      ctx2d.setLineDash([5, 5]);
      ctx2d.lineWidth = 1.5;
      ctx2d.stroke();
      ctx2d.setLineDash([]);

      const current = posAt(stateRef.current.t, rect);
      if (runningRef.current) {
        traceRef.current.push({ x: current.px, y: current.py });
        if (traceRef.current.length > 400) traceRef.current.shift();
      }

      ctx2d.beginPath();
      traceRef.current.forEach((pt, i) => (i === 0 ? ctx2d.moveTo(pt.x, pt.y) : ctx2d.lineTo(pt.x, pt.y)));
      ctx2d.strokeStyle = '#2563eb';
      ctx2d.lineWidth = 2.5;
      ctx2d.stroke();

      ctx2d.beginPath();
      ctx2d.arc(current.px, current.py, 8, 0, Math.PI * 2);
      ctx2d.fillStyle = '#dc2626';
      ctx2d.fill();
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [angle, speed, gravity, angleRad, flightTime, range, maxHeight]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setDisplay({ t: stateRef.current.t });
    }, 150);
    return () => clearInterval(id);
  }, [running]);

  const handleReset = () => {
    stateRef.current = { t: 0, lastTime: 0 };
    traceRef.current = [];
    setDisplay({ t: 0 });
    setRunning(false);
  };

  return (
    <div className={styles.simWrapper}>
      <div className={styles.simToolbar}>
        <div className={styles.group}>
          <button className={styles.playBtn} onClick={() => setRunning((r) => !r)} type="button">
            {running ? <Pause size={16} /> : <Play size={16} />} {running ? 'Тыныгуу' : 'Учуруу'}
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
          <label>Ыргытуу бурчу: {angle}°</label>
          <input type="range" min={5} max={85} step={1} value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
        </div>
        <div className={styles.paramItem}>
          <label>Баштапкы ылдамдык: {speed} м/с</label>
          <input type="range" min={5} max={35} step={1} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
        </div>
      </div>

      <div className={styles.canvasArea} ref={containerRef}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <div className={styles.readouts}>
        <div className={styles.readoutCard}>
          <span className={styles.readoutTag}>Учуу аралыгы</span>
          <Formula tex={'R = \\dfrac{v_0^2 \\sin(2\\theta)}{g}'} />
          <span className={styles.readoutValue}>R ≈ {range.toFixed(1)} м</span>
        </div>
        <div className={styles.readoutCard}>
          <span className={styles.readoutTag}>Эң чоң бийиктик</span>
          <Formula tex={'H = \\dfrac{(v_0 \\sin\\theta)^2}{2g}'} />
          <span className={styles.readoutValue}>H ≈ {maxHeight.toFixed(1)} м</span>
        </div>
        <div className={styles.readoutCard}>
          <span className={styles.readoutTag}>Учуу убактысы</span>
          <span className={styles.readoutValue}>t ≈ {display.t.toFixed(2)} / {flightTime.toFixed(2)} с</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectileSim;
