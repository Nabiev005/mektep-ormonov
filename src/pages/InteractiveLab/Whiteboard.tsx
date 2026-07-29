import { useEffect, useRef, useState } from 'react';
import { Download, Eraser, FolderOpen, Pencil, RotateCcw, Save, Trash2 } from 'lucide-react';
import styles from './Whiteboard.module.css';

const COLORS = ['#0f172a', '#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#7c3aed'];
const SIZES = [3, 6, 12];

type Point = { x: number; y: number };
type BgStyle = 'blank' | 'squared' | 'dots' | 'lined';

const BG_STYLES: { key: BgStyle; label: string }[] = [
  { key: 'blank', label: 'Таза барак' },
  { key: 'squared', label: 'Клетчатка' },
  { key: 'dots', label: 'Чекиттер' },
  { key: 'lined', label: 'Сызыктар' },
];

interface SavedBoard {
  id: string;
  name: string;
  dataUrl: string;
  savedAt: number;
}

const STORAGE_KEY = 'ilab_whiteboard_saves';
const MAX_SAVES = 12;

const loadSavedBoards = (): SavedBoard[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedBoard[]) : [];
  } catch {
    return [];
  }
};

const persistSavedBoards = (boards: SavedBoard[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  } catch {
    /* сактоо орду толуп калса, унутуп коебуз */
  }
};

const paintBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, style: BgStyle) => {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  if (style === 'blank') return;

  ctx.save();
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.25)';
  ctx.fillStyle = 'rgba(100, 116, 139, 0.35)';
  ctx.lineWidth = 1;

  if (style === 'squared') {
    const step = 28;
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
      ctx.stroke();
    }
  } else if (style === 'dots') {
    const step = 24;
    for (let x = step; x < width; x += step) {
      for (let y = step; y < height; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (style === 'lined') {
    const step = 32;
    for (let y = step; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
      ctx.stroke();
    }
  }
  ctx.restore();
};

const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);
  const history = useRef<string[]>([]);
  const bgStyleRef = useRef<BgStyle>('squared');

  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [isEraser, setIsEraser] = useState(false);
  const [bgStyle, setBgStyle] = useState<BgStyle>('squared');
  const [savedBoards, setSavedBoards] = useState<SavedBoard[]>(() => loadSavedBoards());
  const [saveName, setSaveName] = useState('');

  useEffect(() => {
    bgStyleRef.current = bgStyle;
  }, [bgStyle]);

  // Canvasты контейнердин өлчөмүнө ылайыктап тартуу
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        paintBackground(ctx, rect.width, rect.height, bgStyleRef.current);
      }
      history.current = [];
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    history.current.push(canvas.toDataURL());
    if (history.current.length > 25) history.current.shift();
  };

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const point = getPoint(e);
    if (!canvas || !point) return;
    canvas.setPointerCapture(e.pointerId);
    isDrawing.current = true;
    lastPoint.current = point;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    const point = getPoint(e);
    if (!ctx || !point || !lastPoint.current) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? size * 3 : size;
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    lastPoint.current = point;
  };

  const handlePointerUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    lastPoint.current = null;
    saveHistory();
  };

  const handleBgChange = (style: BgStyle) => {
    setBgStyle(style);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    paintBackground(ctx, rect.width, rect.height, style);
    saveHistory();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    paintBackground(ctx, rect.width, rect.height, bgStyle);
    history.current = [];
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    history.current.pop();
    const rect = canvas.getBoundingClientRect();
    const prev = history.current[history.current.length - 1];
    if (prev) {
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = prev;
    } else {
      paintBackground(ctx, rect.width, rect.height, bgStyle);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'doska.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleSaveNamed = () => {
    const canvas = canvasRef.current;
    const name = saveName.trim();
    if (!canvas || !name) return;
    const entry: SavedBoard = {
      id: `b${Date.now()}`,
      name,
      dataUrl: canvas.toDataURL('image/png', 0.82),
      savedAt: Date.now(),
    };
    setSavedBoards((prev) => {
      const next = [entry, ...prev].slice(0, MAX_SAVES);
      persistSavedBoards(next);
      return next;
    });
    setSaveName('');
  };

  const handleLoadSaved = (id: string) => {
    const entry = savedBoards.find((b) => b.id === id);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!entry || !canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      saveHistory();
    };
    img.src = entry.dataUrl;
  };

  const handleDeleteSaved = (id: string) => {
    setSavedBoards((prev) => {
      const next = prev.filter((b) => b.id !== id);
      persistSavedBoards(next);
      return next;
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.group}>
          {COLORS.map((c) => (
            <button
              key={c}
              className={`${styles.swatch} ${!isEraser && color === c ? styles.swatchActive : ''}`}
              style={{ background: c }}
              onClick={() => {
                setColor(c);
                setIsEraser(false);
              }}
              aria-label={`Түс: ${c}`}
            />
          ))}
        </div>

        <div className={styles.group}>
          {SIZES.map((s) => (
            <button
              key={s}
              className={`${styles.sizeBtn} ${size === s ? styles.sizeBtnActive : ''}`}
              onClick={() => setSize(s)}
              aria-label={`Калемдин калыңдыгы: ${s}`}
            >
              <span style={{ width: s + 2, height: s + 2 }} className={styles.sizeDot} />
            </button>
          ))}
        </div>

        <div className={styles.group}>
          <button
            className={`${styles.toolBtn} ${!isEraser ? styles.toolBtnActive : ''}`}
            onClick={() => setIsEraser(false)}
            title="Калем"
          >
            <Pencil size={16} /> Калем
          </button>
          <button
            className={`${styles.toolBtn} ${isEraser ? styles.toolBtnActive : ''}`}
            onClick={() => setIsEraser(true)}
            title="Өчүргүч"
          >
            <Eraser size={16} /> Өчүргүч
          </button>
        </div>

        <div className={styles.group}>
          <button className={styles.toolBtn} onClick={handleUndo} title="Артка кайтаруу">
            <RotateCcw size={16} /> Артка
          </button>
          <button className={styles.toolBtn} onClick={handleClear} title="Тактаны тазалоо">
            <Trash2 size={16} /> Тазалоо
          </button>
          <button className={styles.toolBtnPrimary} onClick={handleDownload} title="Сүрөт катары сактоо (PNG)">
            <Download size={16} /> PNG
          </button>
        </div>
      </div>

      <div className={styles.templateRow}>
        <span className={styles.templateLabel}>Барак үлгүсү:</span>
        {BG_STYLES.map((b) => (
          <button
            key={b.key}
            className={`${styles.templateBtn} ${bgStyle === b.key ? styles.templateBtnActive : ''}`}
            onClick={() => handleBgChange(b.key)}
            type="button"
          >
            {b.label}
          </button>
        ))}
      </div>

      <div ref={containerRef} className={styles.canvasArea}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>

      <div className={styles.savePanel}>
        <div className={styles.saveForm}>
          <input
            className={styles.saveInput}
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Тактанын атын жазыңыз (мис: 5-класс, теорема)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveNamed();
            }}
          />
          <button className={styles.saveBtn} onClick={handleSaveNamed} type="button" disabled={!saveName.trim()}>
            <Save size={16} /> Браузерге сактоо
          </button>
        </div>

        {savedBoards.length > 0 && (
          <div className={styles.savedList}>
            {savedBoards.map((b) => (
              <div key={b.id} className={styles.savedChip}>
                <button type="button" className={styles.savedOpenBtn} onClick={() => handleLoadSaved(b.id)} title="Ачуу">
                  <FolderOpen size={14} /> {b.name}
                </button>
                <button type="button" className={styles.savedDeleteBtn} onClick={() => handleDeleteSaved(b.id)} title="Өчүрүү">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Whiteboard;
