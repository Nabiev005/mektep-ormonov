import { useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  type ChartDataset,
  type TooltipItem,
} from 'chart.js';
import { compile, derivative, parse } from 'mathjs';
import { Eye, EyeOff, Sigma, Trash2 } from 'lucide-react';
import Formula from './Formula';
import { explainFunction } from './mathExplain';
import styles from './MathGraph.module.css';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend);

const PRESETS = [
  { label: 'y = x²', expr: 'x^2' },
  { label: 'y = x³', expr: 'x^3' },
  { label: 'y = sin(x)', expr: 'sin(x)' },
  { label: 'y = cos(x)', expr: 'cos(x)' },
  { label: 'y = tan(x)', expr: 'tan(x)' },
  { label: 'y = √x', expr: 'sqrt(x)' },
  { label: 'y = 1/x', expr: '1/x' },
  { label: 'y = |x|', expr: 'abs(x)' },
];

const COLOR_PALETTE = ['#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#7c3aed', '#0891b2'];
const SAMPLE_COUNT = 500;
const MAX_FUNCTIONS = 6;

interface FnEntry {
  id: string;
  expr: string;
  color: string;
  visible: boolean;
}

let uid = 1;
const nextId = () => `f${uid++}`;

const toLatex = (expr: string): string => {
  try {
    return parse(expr).toTex();
  } catch {
    return expr;
  }
};

const samplePoints = (expr: string, range: number): { points: { x: number; y: number }[]; error: string | null } => {
  try {
    const fn = compile(expr);
    const step = (range * 2) / SAMPLE_COUNT;
    const data: { x: number; y: number }[] = [];
    for (let i = 0; i <= SAMPLE_COUNT; i++) {
      const x = -range + i * step;
      let y = NaN;
      try {
        const result = fn.evaluate({ x });
        if (typeof result === 'number' && Number.isFinite(result) && Math.abs(result) <= range * 25) {
          y = result;
        }
      } catch {
        y = NaN;
      }
      data.push({ x, y });
    }
    return { points: data, error: null };
  } catch {
    return { points: [], error: 'Формула туура эмес. Мисалы: x^2, sin(x), sqrt(x), 1/x' };
  }
};

const MathGraph = () => {
  const [functions, setFunctions] = useState<FnEntry[]>([{ id: nextId(), expr: 'x^2', color: COLOR_PALETTE[0], visible: true }]);
  const [activeId, setActiveId] = useState(functions[0].id);
  const [input, setInput] = useState('');
  const [range, setRange] = useState(10);
  const [showTangent, setShowTangent] = useState(false);
  const [tangentX, setTangentX] = useState(2);
  const formRef = useRef<HTMLFormElement>(null);

  const activeEntry = functions.find((f) => f.id === activeId) ?? functions[0];

  const addFunction = (expr: string) => {
    const trimmed = expr.trim();
    if (!trimmed || functions.length >= MAX_FUNCTIONS) return;
    const color = COLOR_PALETTE[functions.length % COLOR_PALETTE.length];
    const entry: FnEntry = { id: nextId(), expr: trimmed, color, visible: true };
    setFunctions((prev) => [...prev, entry]);
    setActiveId(entry.id);
    setInput('');
  };

  const removeFunction = (id: string) => {
    setFunctions((prev) => {
      const next = prev.filter((f) => f.id !== id);
      return next.length ? next : prev;
    });
    setActiveId((prev) => (prev === id ? functions.find((f) => f.id !== id)?.id ?? prev : prev));
  };

  const toggleVisible = (id: string) => {
    setFunctions((prev) => prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)));
  };

  const computed = useMemo(
    () => functions.map((f) => ({ ...f, ...samplePoints(f.expr, range) })),
    [functions, range],
  );

  const tangent = useMemo(() => {
    if (!showTangent || !activeEntry) return null;
    try {
      const derivNode = derivative(activeEntry.expr, 'x');
      const derivFn = derivNode.compile();
      const fn = compile(activeEntry.expr);
      const y0 = fn.evaluate({ x: tangentX });
      const slope = derivFn.evaluate({ x: tangentX });
      if (typeof y0 !== 'number' || typeof slope !== 'number' || !Number.isFinite(y0) || !Number.isFinite(slope)) {
        return null;
      }
      const x1 = -range;
      const x2 = range;
      return {
        line: [
          { x: x1, y: y0 + slope * (x1 - tangentX) },
          { x: x2, y: y0 + slope * (x2 - tangentX) },
        ],
        point: [{ x: tangentX, y: y0 }],
        slope,
        y0,
        tex: derivNode.toTex(),
      };
    } catch {
      return null;
    }
  }, [showTangent, activeEntry, tangentX, range]);

  const insight = activeEntry ? explainFunction(activeEntry.expr) : null;

  const datasets: ChartDataset<'line', { x: number; y: number }[]>[] = computed
    .filter((f) => f.visible)
    .map((f) => ({
      label: `y = ${f.expr}`,
      data: f.points,
      borderColor: f.color,
      backgroundColor: `${f.color}20`,
      borderWidth: f.id === activeId ? 3 : 2,
      pointRadius: 0,
      pointHitRadius: 6,
      tension: 0.12,
      spanGaps: false,
    }));

  if (tangent) {
    datasets.push({
      label: 'Тангенс сызык',
      data: tangent.line,
      borderColor: '#0f172a',
      borderDash: [8, 5],
      borderWidth: 2,
      pointRadius: 0,
      tension: 0,
      spanGaps: false,
    });
    datasets.push({
      label: `Чекит (x=${tangentX})`,
      data: tangent.point,
      borderColor: '#0f172a',
      backgroundColor: '#0f172a',
      pointRadius: 6,
      pointHoverRadius: 7,
      showLine: false,
    });
  }

  const chartData = { datasets };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    parsing: false as const,
    animation: false as const,
    scales: {
      x: {
        type: 'linear' as const,
        min: -range,
        max: range,
        grid: { color: 'rgba(148,163,184,0.25)' },
        title: { display: true, text: 'x' },
      },
      y: {
        type: 'linear' as const,
        min: -range,
        max: range,
        grid: { color: 'rgba(148,163,184,0.25)' },
        title: { display: true, text: 'y' },
      },
    },
    plugins: {
      legend: { display: true, labels: { font: { size: 12, weight: 700 as const } } },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'line'>) => {
            const p = ctx.parsed as { x: number; y: number };
            return `${ctx.dataset.label}: x = ${p.x.toFixed(2)}, y = ${p.y.toFixed(2)}`;
          },
        },
      },
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFunction(input);
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} ref={formRef} onSubmit={handleSubmit}>
        <div className={styles.inputRow}>
          <span className={styles.yEquals}><Sigma size={16} /> y =</span>
          <input
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Мисалы: x^2, sin(x), sqrt(x)..."
            spellCheck={false}
          />
          <button type="submit" className={styles.drawBtn} disabled={functions.length >= MAX_FUNCTIONS}>
            Кошуу
          </button>
        </div>

        <div className={styles.rangeRow}>
          <label htmlFor="range">Диапазон: −{range} … {range}</label>
          <input
            id="range"
            type="range"
            min={2}
            max={30}
            step={1}
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
          />
        </div>
      </form>

      <div className={styles.presets}>
        {PRESETS.map((p) => (
          <button
            key={p.expr}
            className={styles.presetBtn}
            onClick={() => addFunction(p.expr)}
            type="button"
            disabled={functions.length >= MAX_FUNCTIONS}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.fnList}>
        {computed.map((f) => (
          <div key={f.id} className={`${styles.fnChip} ${f.id === activeId ? styles.fnChipActive : ''}`}>
            <button type="button" className={styles.fnSwatch} style={{ background: f.color }} onClick={() => setActiveId(f.id)} />
            <button type="button" className={styles.fnLabel} onClick={() => setActiveId(f.id)}>
              <Formula tex={`y=${toLatex(f.expr)}`} />
            </button>
            <button type="button" className={styles.fnIconBtn} onClick={() => toggleVisible(f.id)} title="Көрсөтүү/жашыруу">
              {f.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            {functions.length > 1 && (
              <button type="button" className={styles.fnIconBtn} onClick={() => removeFunction(f.id)} title="Өчүрүү">
                <Trash2 size={14} />
              </button>
            )}
            {f.error && <span className={styles.fnError}>⚠</span>}
          </div>
        ))}
      </div>

      <div className={styles.tangentPanel}>
        <label className={styles.tangentToggle}>
          <input type="checkbox" checked={showTangent} onChange={(e) => setShowTangent(e.target.checked)} />
          Тандалган функцияга тангенс сызык тартуу
        </label>
        {showTangent && (
          <div className={styles.tangentControls}>
            <input
              type="range"
              min={-range}
              max={range}
              step={0.1}
              value={tangentX}
              onChange={(e) => setTangentX(Number(e.target.value))}
            />
            <span className={styles.tangentValue}>x = {tangentX.toFixed(1)}</span>
            {tangent && (
              <span className={styles.tangentSlope}>
                Туунду: <Formula tex={`f'(x)=${tangent.tex}`} /> → к = {tangent.slope.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className={styles.chartArea}>
        <Line data={chartData} options={chartOptions} />
      </div>

      {insight && activeEntry && (
        <div className={styles.insightPanel}>
          <h3>
            <Formula tex={`y=${toLatex(activeEntry.expr)}`} /> — талдоо
          </h3>
          <div className={styles.insightGrid}>
            <div className={styles.insightCard}>
              <span className={styles.insightTag}>Түрү</span>
              <p>{insight.category}</p>
            </div>
            <div className={styles.insightCard}>
              <span className={styles.insightTag}>Аныктоо чөйрөсү</span>
              <p>{insight.domain}</p>
            </div>
            <div className={styles.insightCard}>
              <span className={styles.insightTag}>Симметрия</span>
              <p>{insight.symmetry}</p>
            </div>
            <div className={styles.insightCard}>
              <span className={styles.insightTag}>Жүрүм-туруму</span>
              <p>{insight.behavior}</p>
            </div>
          </div>
          {insight.notes.length > 0 && (
            <ul className={styles.insightNotes}>
              {insight.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default MathGraph;
