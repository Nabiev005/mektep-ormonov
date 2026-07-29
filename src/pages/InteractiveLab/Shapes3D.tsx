import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw } from 'lucide-react';
import Formula from './Formula';
import styles from './Shapes3D.module.css';

type ShapeKey = 'cube' | 'sphere' | 'cylinder' | 'cone' | 'pyramid' | 'torus';

interface ParamDef {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

interface ShapeMetrics {
  volume: number;
  area: number;
  volumeTex: string;
  areaTex: string;
}

interface ShapeDef {
  key: ShapeKey;
  label: string;
  icon: string;
  params: ParamDef[];
  geometry: (p: Record<string, number>) => THREE.BufferGeometry;
  metrics: (p: Record<string, number>) => ShapeMetrics;
}

const SHAPE_DEFS: ShapeDef[] = [
  {
    key: 'cube',
    label: 'Куб',
    icon: '🧊',
    params: [{ key: 'a', label: 'Кыры (a)', min: 0.6, max: 2.5, step: 0.1, default: 1.6 }],
    geometry: (p) => new THREE.BoxGeometry(p.a, p.a, p.a),
    metrics: (p) => ({
      volume: p.a ** 3,
      area: 6 * p.a ** 2,
      volumeTex: 'V = a^3',
      areaTex: 'S = 6a^2',
    }),
  },
  {
    key: 'sphere',
    label: 'Шар',
    icon: '🔮',
    params: [{ key: 'r', label: 'Радиусу (r)', min: 0.5, max: 2, step: 0.1, default: 1.2 }],
    geometry: (p) => new THREE.SphereGeometry(p.r, 40, 30),
    metrics: (p) => ({
      volume: (4 / 3) * Math.PI * p.r ** 3,
      area: 4 * Math.PI * p.r ** 2,
      volumeTex: 'V = \\frac{4}{3}\\pi r^3',
      areaTex: 'S = 4\\pi r^2',
    }),
  },
  {
    key: 'cylinder',
    label: 'Цилиндр',
    icon: '🥤',
    params: [
      { key: 'r', label: 'Радиусу (r)', min: 0.4, max: 1.8, step: 0.1, default: 1 },
      { key: 'h', label: 'Бийиктиги (h)', min: 0.6, max: 3, step: 0.1, default: 2 },
    ],
    geometry: (p) => new THREE.CylinderGeometry(p.r, p.r, p.h, 40),
    metrics: (p) => ({
      volume: Math.PI * p.r ** 2 * p.h,
      area: 2 * Math.PI * p.r * (p.r + p.h),
      volumeTex: 'V = \\pi r^2 h',
      areaTex: 'S = 2\\pi r (r + h)',
    }),
  },
  {
    key: 'cone',
    label: 'Конус',
    icon: '🍦',
    params: [
      { key: 'r', label: 'Радиусу (r)', min: 0.4, max: 1.8, step: 0.1, default: 1 },
      { key: 'h', label: 'Бийиктиги (h)', min: 0.6, max: 3, step: 0.1, default: 2 },
    ],
    geometry: (p) => new THREE.ConeGeometry(p.r, p.h, 40),
    metrics: (p) => {
      const slant = Math.sqrt(p.r ** 2 + p.h ** 2);
      return {
        volume: (1 / 3) * Math.PI * p.r ** 2 * p.h,
        area: Math.PI * p.r * (p.r + slant),
        volumeTex: 'V = \\frac{1}{3}\\pi r^2 h',
        areaTex: 'S = \\pi r (r + l),\\ l=\\sqrt{r^2+h^2}',
      };
    },
  },
  {
    key: 'pyramid',
    label: 'Пирамида',
    icon: '🔺',
    params: [
      { key: 'a', label: 'Негизи (a)', min: 0.6, max: 2.4, step: 0.1, default: 1.6 },
      { key: 'h', label: 'Бийиктиги (h)', min: 0.6, max: 3, step: 0.1, default: 2 },
    ],
    geometry: (p) => new THREE.ConeGeometry(p.a / Math.SQRT2, p.h, 4),
    metrics: (p) => {
      const slant = Math.sqrt(p.h ** 2 + (p.a / 2) ** 2);
      return {
        volume: (1 / 3) * p.a ** 2 * p.h,
        area: p.a ** 2 + 2 * p.a * slant,
        volumeTex: 'V = \\frac{1}{3} a^2 h',
        areaTex: 'S = a^2 + 2al,\\ l=\\sqrt{h^2+(a/2)^2}',
      };
    },
  },
  {
    key: 'torus',
    label: 'Тор',
    icon: '🍩',
    params: [
      { key: 'R', label: 'Чоң радиус (R)', min: 0.8, max: 1.8, step: 0.1, default: 1.3 },
      { key: 'r', label: 'Кичине радиус (r)', min: 0.2, max: 0.8, step: 0.05, default: 0.45 },
    ],
    geometry: (p) => new THREE.TorusGeometry(p.R, p.r, 24, 60),
    metrics: (p) => ({
      volume: 2 * Math.PI ** 2 * p.R * p.r ** 2,
      area: 4 * Math.PI ** 2 * p.R * p.r,
      volumeTex: 'V = 2\\pi^2 R r^2',
      areaTex: 'S = 4\\pi^2 R r',
    }),
  },
];

const defaultParams = (def: ShapeDef): Record<string, number> =>
  Object.fromEntries(def.params.map((p) => [p.key, p.default]));

interface SceneRefs {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  mesh: THREE.Mesh;
  edges: THREE.LineSegments;
  plane: THREE.Plane;
}

const Shapes3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneRefs | null>(null);

  const [shapeKey, setShapeKey] = useState<ShapeKey>('cube');
  const shapeDef = SHAPE_DEFS.find((d) => d.key === shapeKey) ?? SHAPE_DEFS[0];
  const [params, setParams] = useState<Record<string, number>>(() => defaultParams(shapeDef));
  const [color, setColor] = useState('#2563eb');
  const [showEdges, setShowEdges] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [crossSection, setCrossSection] = useState(false);
  const [cutOffset, setCutOffset] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.6, 2.8, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.5;
    controls.maxDistance = 14;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.2;

    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(4, 6, 5);
    const dirLight2 = new THREE.DirectionalLight(0x93c5fd, 0.45);
    dirLight2.position.set(-4, -2, -3);
    scene.add(ambient, dirLight, dirLight2);

    const grid = new THREE.GridHelper(10, 20, 0xcbd5e1, 0xe2e8f0);
    grid.position.y = -2.4;
    scene.add(grid);

    const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);

    const geometry = SHAPE_DEFS[0].geometry(defaultParams(SHAPE_DEFS[0]));
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2563eb'),
      metalness: 0.15,
      roughness: 0.45,
      side: THREE.DoubleSide,
      clippingPlanes: [],
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const edgesGeo = new THREE.EdgesGeometry(geometry);
    const edges = new THREE.LineSegments(edgesGeo, new THREE.LineBasicMaterial({ color: 0x0f172a }));
    mesh.add(edges);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    sceneRef.current = { renderer, camera, controls, mesh, edges, plane };

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      mesh.geometry.dispose();
      edges.geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    const newGeometry = shapeDef.geometry(params);
    ctx.mesh.geometry.dispose();
    ctx.mesh.geometry = newGeometry;

    const newEdgesGeo = new THREE.EdgesGeometry(newGeometry);
    ctx.edges.geometry.dispose();
    ctx.edges.geometry = newEdgesGeo;
  }, [shapeDef, params]);

  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    (ctx.mesh.material as THREE.MeshStandardMaterial).color.set(color);
  }, [color]);

  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    ctx.edges.visible = showEdges;
  }, [showEdges]);

  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    ctx.controls.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const ctx = sceneRef.current;
    if (!ctx) return;
    const material = ctx.mesh.material as THREE.MeshStandardMaterial;
    if (crossSection) {
      ctx.plane.constant = cutOffset;
      material.clippingPlanes = [ctx.plane];
    } else {
      material.clippingPlanes = [];
    }
  }, [crossSection, cutOffset]);

  const handleShapeChange = (key: ShapeKey) => {
    const def = SHAPE_DEFS.find((d) => d.key === key) ?? SHAPE_DEFS[0];
    setShapeKey(key);
    setParams(defaultParams(def));
  };

  const metrics = shapeDef.metrics(params);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.group}>
          {SHAPE_DEFS.map((s) => (
            <button
              key={s.key}
              className={`${styles.shapeBtn} ${shapeKey === s.key ? styles.shapeBtnActive : ''}`}
              onClick={() => handleShapeChange(s.key)}
              type="button"
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        <div className={styles.group}>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className={styles.colorInput}
            title="Түс тандоо"
          />
          <button
            className={`${styles.toggleBtn} ${showEdges ? styles.toggleActive : ''}`}
            onClick={() => setShowEdges((v) => !v)}
            type="button"
          >
            Кырлар
          </button>
          <button
            className={`${styles.toggleBtn} ${autoRotate ? styles.toggleActive : ''}`}
            onClick={() => setAutoRotate((v) => !v)}
            type="button"
          >
            Айлануу
          </button>
        </div>
      </div>

      <div className={styles.paramsRow}>
        {shapeDef.params.map((pd) => (
          <div key={pd.key} className={styles.paramItem}>
            <label>{pd.label}: {params[pd.key]?.toFixed(2)}</label>
            <input
              type="range"
              min={pd.min}
              max={pd.max}
              step={pd.step}
              value={params[pd.key] ?? pd.default}
              onChange={(e) => setParams((prev) => ({ ...prev, [pd.key]: Number(e.target.value) }))}
            />
          </div>
        ))}
      </div>

      <div className={styles.viewport} ref={mountRef} />

      <div className={styles.metricsPanel}>
        <div className={styles.metricCard}>
          <span className={styles.metricTag}>Көлөмү</span>
          <Formula tex={metrics.volumeTex} />
          <span className={styles.metricValue}>V ≈ {metrics.volume.toFixed(2)}</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricTag}>Бет аянты</span>
          <Formula tex={metrics.areaTex} />
          <span className={styles.metricValue}>S ≈ {metrics.area.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.cutPanel}>
        <label className={styles.cutToggle}>
          <input type="checkbox" checked={crossSection} onChange={(e) => setCrossSection(e.target.checked)} />
          Кесилиш көрүнүшү (фигураны кесип, ичин көрүү)
        </label>
        {crossSection && (
          <div className={styles.cutSliderRow}>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.05}
              value={cutOffset}
              onChange={(e) => setCutOffset(Number(e.target.value))}
            />
            <button className={styles.resetBtn} onClick={() => setCutOffset(0)} title="Ортого кайтаруу" type="button">
              <RotateCcw size={14} />
            </button>
          </div>
        )}
      </div>

      <p className={styles.hint}>Чычкан/манжа менен сүйрөп фигураны ар тарапка бурап, тегеретип масштабдап көрүңүз.</p>
    </div>
  );
};

export default Shapes3D;
