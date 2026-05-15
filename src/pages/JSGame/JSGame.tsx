/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Braces, Code2, FileCode2, Layers3, Palette, Rocket, Sparkles, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { levels as jsLevels } from './levels';
import { htmlLevels } from './htmlLevels';
import { cssLevels } from './cssLevels';
import { auth } from '../../firebase';
import { recordStudentCourseProgress } from '../../utils/studentAccount';
import styles from './JSGame.module.css';

type GameMode = 'JS' | 'HTML' | 'CSS';

const modeMeta = {
  HTML: {
    title: 'HTML',
    icon: FileCode2,
    emoji: '🏗️',
    subtitle: 'Сайттын түзүлүшү',
    description: 'Текст, сүрөт, кнопка, бөлүм жана баракчанын негизги скелетин түзүүнү үйрөнөсүз.',
    points: ['Тегдер', 'Заголовок жана текст', 'Сүрөт жана шилтеме'],
  },
  CSS: {
    title: 'CSS',
    icon: Palette,
    emoji: '🎨',
    subtitle: 'Дизайн жана стиль',
    description: 'Түстөр, өлчөмдөр, аралык, карточка, responsive көрүнүш жана кооз интерфейс түзөсүз.',
    points: ['Түс жана фон', 'Layout', 'Адаптив дизайн'],
  },
  JS: {
    title: 'JavaScript',
    icon: Braces,
    emoji: '⚡',
    subtitle: 'Логика жана аракет',
    description: 'Өзгөрмө, шарт, функция жана интерактивдүү логика аркылуу сайтты жандандырасыз.',
    points: ['Variable', 'Function', 'Шарт жана эсеп'],
  },
} satisfies Record<GameMode, {
  title: string;
  icon: LucideIcon;
  emoji: string;
  subtitle: string;
  description: string;
  points: string[];
}>;

const JSGame: React.FC = () => {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [code, setCode] = useState('');
  const [level, setLevel] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [heroName, setHeroName] = useState('Баатыр');
  const [showCert, setShowCert] = useState(false);
  const [fullName, setFullName] = useState('');
  
  // ЖАҢЫ: Деңгээлдердин тизмесин ачып/жабуу үчүн абал
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  // ЖАҢЫ КОШУЛДУ: JavaScript кодунун жыйынтыгын сактоо үчүн
  const [jsOutput, setJsOutput] = useState<string>('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_heroAge, setHeroAge] = useState('?');

  // --- ПРОГРЕССТИ САКТОО ЛОГИКАСЫ ---
  const [progress, setProgress] = useState<{ [key in GameMode]: number }>(() => {
    const saved = localStorage.getItem('dev_journey_progress');
    return saved ? JSON.parse(saved) : { HTML: 0, CSS: 0, JS: 0 };
  });

  useEffect(() => {
    localStorage.setItem('dev_journey_progress', JSON.stringify(progress));
    const completed = progress.HTML + progress.CSS + progress.JS;
    const total = htmlLevels.length + cssLevels.length + jsLevels.length;
    recordStudentCourseProgress(auth.currentUser, {
      source: 'frontend_course',
      title: 'Frontend',
      progressPercent: Math.round((completed / total) * 100),
      completed,
      total,
      score: completed,
      meta: {
        html: progress.HTML,
        css: progress.CSS,
        js: progress.JS,
      },
    }).catch(() => undefined);
  }, [progress]);

  // ЖАҢЫ КОШУЛДУ: JavaScript кодун реалдуу убакытта текшерүү
  useEffect(() => {
    if (mode === 'JS' && code.trim()) {
      try {
        const logs: string[] = [];
        const mockConsole = {
          log: (...args: any[]) => logs.push(args.map(a => String(a)).join(' '))
        };
        // Коопсуз иштетүү
        const result = new Function('console', `try { return ${code} } catch(e) { ${code} }`)(mockConsole);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setJsOutput(logs.length > 0 ? logs.join('\n') : (result !== undefined ? String(result) : ''));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setJsOutput('...'); // Код жазылып жатканда
      }
    } else {
      setJsOutput('');
    }
  }, [code, mode]);

  // Бардык курстардын бүткөнүн текшерүү
  const isAllCompleted = useMemo(() => {
    return (
      progress.HTML >= htmlLevels.length &&
      progress.CSS >= cssLevels.length &&
      progress.JS >= jsLevels.length
    );
  }, [progress]);

  const currentLevels = useMemo(() => {
    if (mode === 'HTML') return htmlLevels;
    if (mode === 'CSS') return cssLevels;
    return jsLevels;
  }, [mode]);

  const currentLevelData = currentLevels[level - 1];

  const dynamicStyles = useMemo(() => {
    if (mode !== 'CSS') return {};
    const obj: any = {};
    code.split(';').forEach(pair => {
      const [prop, val] = pair.split(':');
      if (prop && val) {
        const camelProp = prop.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        obj[camelProp] = val.trim();
      }
    });
    return obj;
  }, [code, mode]);

  const handleRunCode = () => {
    setError('');
    if (currentLevelData.check(code)) {
      if (mode === 'JS' && (currentLevelData as any).updateStats) {
        (currentLevelData as any).updateStats(code, setHeroName, setHeroAge);
      }
      
      if (level > progress[mode!]) {
        setProgress(prev => ({ ...prev, [mode!]: level }));
      }
      
      setIsSuccess(true);
    } else {
      setError('Код туура эмес. Кайра текшерип көрүңүз!');
    }
  };

  const nextLevel = () => {
    setIsSuccess(false);
    if (level < currentLevels.length) {
      setLevel(prev => prev + 1);
      setCode('');
    } else {
      alert(`${mode} курсун ийгиликтүү аяктадыңыз! 🎉`);
      setMode(null);
      setLevel(1);
    }
  };

  if (!mode) {
    return (
      <div className={styles.dashboardContainer}>
        <motion.div 
          initial={{ opacity: 0, y: 18 }} 
          animate={{ opacity: 1, y: 0 }}
          className={styles.frontendHero}
        >
          <div className={styles.frontendHeroText}>
            <span className={styles.frontendEyebrow}>
              <Code2 size={18} />
              Frontend IT курсу
            </span>
            <h1 className={styles.mainTitle}>Frontend программисттин саякаты</h1>
            <p>
              Бул бөлүмдө окуучу сайттын көрүнгөн бөлүгүн жасоону үйрөнөт:
              HTML менен түзүлүш, CSS менен дизайн, JavaScript менен интерактивдүү аракет.
            </p>
          </div>

          <div className={styles.frontendStats}>
            <div>
              <Layers3 size={23} />
              <strong>3 этап</strong>
              <span>HTML, CSS, JS</span>
            </div>
            <div>
              <Rocket size={23} />
              <strong>Практика</strong>
              <span>Код жазып үйрөнүү</span>
            </div>
          </div>
        </motion.div>

        <div className={styles.frontendExplain}>
          <article>
            <Sparkles size={22} />
            <h3>Frontend деген эмне?</h3>
            <p>
              Frontend - колдонуучу көргөн бет: меню, текст, сүрөт, кнопка,
              форма жана анимация. Башкача айтканда, сайттын жүзү жана колдонуу ыңгайлуулугу.
            </p>
          </article>
          <article>
            <Trophy size={22} />
            <h3>Кантип окуйт?</h3>
            <p>
              Ар бир деңгээлде кыска түшүндүрмө, тапшырма, код жазуу жана дароо preview бар.
              Үч багытты бүтүргөндө сертификат ачылат.
            </p>
          </article>
        </div>

        {isAllCompleted && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className={styles.explanationInline}
            style={{ borderLeftColor: '#10b981', marginBottom: '30px', cursor: 'pointer' }}
            onClick={() => setShowCert(true)}
          >
            <h3 style={{ color: '#10b981', margin: 0 }}>🎉 Куттуктайбыз! Бардык курстар бүттү!</h3>
            <p style={{ margin: '5px 0' }}>Өзүңүздүн сертификатыңызды азыр алыңыз.</p>
            <button className={styles.runBtn} style={{ margin: '10px 0 0 0' }}>Сертификатты ачуу</button>
          </motion.div>
        )}

        <div className={styles.cardGrid}>
          {(['HTML', 'CSS', 'JS'] as GameMode[]).map((m) => {
            const completed = progress[m];
            const total = m === 'HTML' ? htmlLevels.length : m === 'CSS' ? cssLevels.length : jsLevels.length;
            const percent = Math.round((completed / total) * 100);

            return (
              <motion.div 
                key={m}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`${styles.menuCard} ${styles[m.toLowerCase() + 'Card']}`}
                onClick={() => {
                  setMode(m); 
                  setLevel(completed + 1 > total ? total : completed + 1); 
                  setCode('');
                }}
              >
                {(() => {
                  const meta = modeMeta[m];
                  const Icon = meta.icon;
                  return (
                    <>
                      <div className={styles.cardIcon}>
                        <Icon size={40} />
                        <span>{meta.emoji}</span>
                      </div>
                      <h2>{meta.title}</h2>
                      <strong className={styles.modeSubtitle}>{meta.subtitle}</strong>
                      <p>{meta.description}</p>
                      <ul className={styles.modePoints}>
                        {meta.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </>
                  );
                })()}

                <div className={styles.progressContainer}>
                  <div className={styles.progressLabel}>
                    <span>{percent}% бүтүрүлдү</span>
                    <span>{completed}/{total}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <motion.div 
                      className={styles.progressFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
                <div className={styles.levelInfo}>{total} Деңгээл</div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {showCert && (
            <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.div 
                className={styles.certificatePaper}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  background: 'white',
                  color: '#1e293b',
                  padding: '40px',
                  borderRadius: '10px',
                  maxWidth: '850px',
                  width: '95%',
                  textAlign: 'center',
                  border: '15px solid #1e293b',
                  position: 'relative',
                  boxShadow: '0 0 50px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ border: '2px solid #3b82f6', padding: '30px' }}>
                  <h3 style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#1e293b', fontSize: '1.1rem', margin: '0' }}>
                    ЗАЙИЛ ОРМОНОВ АТЫНДАГЫ ОРТО МЕКТЕБИ
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>
                    МЕКТЕПТИН ЖЕКЕ IT-ПРОГРАММАЛОО КУРСУ
                  </p>
                  
                  <h1 style={{ fontSize: '3.5rem', margin: '20px 0', fontFamily: 'serif', color: '#1e293b' }}>СЕРТИФИКАТ</h1>
                  <p style={{ fontSize: '1.2rem', color: '#475569' }}>Бул документ окууну ийгиликтүү аяктагандыгы тууралуу берилет:</p>
                  
                  {fullName === '' ? (
                    <div style={{ margin: '30px 0' }}>
                      <input 
                        type="text" 
                        placeholder="Аты-жөнүңүздү жазыңыз..." 
                        style={{ padding: '12px', width: '80%', fontSize: '1.5rem', textAlign: 'center', border: 'none', borderBottom: '3px solid #1e293b', outline: 'none', background: 'transparent', fontWeight: 'bold' }}
                        onKeyDown={(e) => e.key === 'Enter' && setFullName((e.target as HTMLInputElement).value)}
                        onBlur={(e) => setFullName(e.target.value)}
                      />
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px' }}>Атыңызды жазып 'Enter' басыңыз</p>
                    </div>
                  ) : (
                    <h2 style={{ fontSize: '4rem', color: '#3b82f6', fontFamily: 'serif', margin: '15px 0', textDecoration: 'underline' }}>{fullName}</h2>
                  )}

                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#1e293b', maxWidth: '700px', margin: '0 auto' }}>
                    Зайил Ормонов атындагы орто мектебинин жеке IT курсунун алкагында <br />
                    <b>HTML, CSS жана JavaScript</b> багыттарын толук өздөштүрүп, <br />
                    практикалык тапшырмаларды ийгиликтүү аяктады.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', padding: '0 20px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ borderTop: '1px solid #1e293b', width: '200px', paddingTop: '5px' }}>
                        <b>Директор: Арапов Б.</b>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ borderTop: '1px solid #1e293b', width: '200px', paddingTop: '5px' }}>
                        <b>Дата: {new Date().toLocaleDateString()}</b>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: '25px', display: 'flex', gap: '15px', justifyContent: 'center' }} className="no-print">
                  <button 
                    onClick={() => window.print()} 
                    className={styles.runBtn}
                    style={{ background: '#10b981' }}
                  >
                    🖨️ Печать / PDF сактоо
                  </button>
                  <button onClick={() => setShowCert(false)} className={styles.nextBtn}>Жабуу</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => setMode(null)} className={styles.levelBadge} style={{ cursor: 'pointer', background: 'blue', color: 'white', border: 'none' }}>⬅ Артка</button>
        
        <div style={{ position: 'relative' }}>
          <div 
            className={styles.levelBadge} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={() => setShowLevelDropdown(!showLevelDropdown)}
          >
            {mode}: Деңгээл {level} / {currentLevels.length} ▾
          </div>

          <AnimatePresence>
            {showLevelDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  background: '#1e293b',
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  marginTop: '10px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  width: '200px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}
              >
                {currentLevels.map((_, index) => (
                  <div 
                    key={index}
                    onClick={() => {
                      setLevel(index + 1);
                      setCode('');
                      setIsSuccess(false);
                      setShowLevelDropdown(false);
                    }}
                    style={{
                      padding: '10px 15px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #334155',
                      color: level === index + 1 ? '#3b82f6' : 'white',
                      background: level === index + 1 ? '#0f172a' : 'transparent',
                    }}
                  >
                    Деңгээл {index + 1} { (index + 1) <= progress[mode!] ? '✅' : '' }
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.stats}>
          <span>Каарман: <b>{heroName}</b></span>
        </div>
      </header>

      <div className={styles.gameLayout}>
        <section className={styles.previewSection}>
          <div className={styles.scene}>
            <div className={styles.liveDisplay}>
              {mode === 'HTML' ? (
                <div 
                  className={styles.htmlOutput} 
                  dangerouslySetInnerHTML={{ __html: code }} 
                />
              ) : mode === 'CSS' ? (
                <div className={styles.cssPreviewBox} style={dynamicStyles}>
                  {code.includes('content') ? "" : "Текст"}
                </div>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <motion.div 
                      animate={isSuccess ? { scale: [1, 1.2, 1], y: [0, -20, 0] } : {}}
                      className={styles.character}
                    >
                      🏃‍♂️
                    </motion.div>
                  </div>
                  {/* ЖАҢЫ КОШУЛДУ: JavaScript консолу */}
                  <div style={{ background: '#0f172a', padding: '10px', height: '60px', borderRadius: '5px', color: '#10b981', fontFamily: 'monospace', textAlign: 'left', border: '1px solid #334155', overflowY: 'auto', fontSize: '13px' }}>
                    <div style={{ color: '#64748b', fontSize: '10px', marginBottom: '4px' }}>CONSOLE OUTPUT:</div>
                    {jsOutput || '> ...'}
                  </div>
                </div>
              )}
            </div>
            <div className={styles.floor}></div>
          </div>

          <div className={styles.instructions}>
            <div className={styles.taskHeader}>
              <h3>{currentLevelData.title}</h3>
              <p className={styles.taskText}>{currentLevelData.task}</p>
            </div>
            
            <div className={styles.explanationInline}>
              <h4>💡 Түшүндүрмө:</h4>
              <ul className={styles.pointsList}>
                {currentLevelData.explanation.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.editorSection}>
          <div className={styles.terminalHeader}>
            <span>{mode.toLowerCase()}.index</span>
          </div>
          <textarea
            className={styles.codeArea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`${mode} кодун жаз...`}
            spellCheck={false}
          />
          {error && <div className={styles.error}>{error}</div>}
          <button className={styles.runBtn} onClick={handleRunCode}>Текшерүү</button>
        </section>
      </div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className={styles.modal}>
              <h2>Укмуш! 🎉</h2>
              <p>Сиз бул тапшырманы туура аткардыңыз.</p>
              <button onClick={nextLevel} className={styles.nextBtn}>Кийинки деңгээлге өтүү</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JSGame;
