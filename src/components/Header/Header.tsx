/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onExpandedChange?: (expanded: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onExpandedChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navClass = (path: string) => `nav-link${isActive(path) ? ' active' : ''}`;
  const uppercase = 'uppercase';

  const toggleMenu = () => setIsOpen(prev => !prev);

  // Баракча алмашканда менюну жабуу
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    onExpandedChange?.(!isMobile && isOpen);
  }, [isOpen, isMobile, onExpandedChange]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Меню ачылганда арткы фонду жылдырбоо
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile]);

  const s = {
    burgerBtn: {
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      position: 'fixed' as 'fixed',
      top: '15px',
      left: !isMobile && isOpen ? '306px' : '15px',
      zIndex: 6000,
      width: '46px',
      height: '46px',
      background: 'linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)',
      border: 'none',
      borderRadius: '14px',
      padding: '12px',
      cursor: 'pointer',
      display: 'flex',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      boxShadow: '0 14px 28px rgba(37, 99, 235, 0.28)',
      transition: 'left 0.26s ease, transform 0.2s ease, box-shadow 0.2s ease',
    },
    line: {
      width: '20px',
      height: '2px',
      background: '#fff',
      transition: '0.3s',
    },
    sidebar: {
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      position: 'fixed' as 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: isMobile || isOpen ? '292px' : '76px',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 48%, #eef6ff 100%)',
      borderRight: '1px solid rgba(148, 163, 184, 0.18)',
      display: 'flex',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      flexDirection: 'column' as 'column',
      zIndex: 5000,
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      overflowY: 'auto' as 'auto',
      overflowX: 'hidden' as const,
      fontFamily: '"Inter", sans-serif',
      boxShadow: '18px 0 45px rgba(15, 23, 42, 0.08)',
      transition: 'width 0.26s ease',
    },
    overlay: {
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      position: 'fixed' as 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.56)',
      backdropFilter: 'blur(4px)',
      zIndex: 4500,
    },
    logoContainer: {
      margin: isMobile || isOpen ? '16px' : '74px 10px 14px',
      padding: isMobile || isOpen ? '18px' : '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      textDecoration: 'none',
      borderRadius: '18px',
      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(20, 184, 166, 0.12))',
      border: '1px solid rgba(37, 99, 235, 0.12)',
      boxShadow: '0 16px 36px rgba(37, 99, 235, 0.08)',
    },
    logoIcon: {
      width: '42px',
      height: '42px',
      borderRadius: '14px',
      display: 'grid',
      placeItems: 'center',
      color: '#fff',
      fontSize: '20px',
      background: 'linear-gradient(135deg, #2563eb, #0f766e)',
      boxShadow: '0 12px 24px rgba(37, 99, 235, 0.28)',
      flex: '0 0 auto',
    },
    logoCopy: {
      display: 'flex',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      flexDirection: 'column' as 'column',
      minWidth: 0,
    },
    logoText: {
      fontSize: '21px',
      fontWeight: '800',
      color: '#0f172a',
      lineHeight: 1.1,
    },
    logoMeta: {
      marginTop: '4px',
      fontSize: '11px',
      fontWeight: '700',
      color: '#0f766e',
      letterSpacing: '0.2px',
    },
    menuSection: {
      padding: isMobile || isOpen ? '0 14px 18px 14px' : '0 10px 10px',
    },
    sectionTitle: {
      padding: '0 12px',
      fontSize: '11px',
      fontWeight: '700',
      color: '#64748b',
      textTransform: uppercase,
      letterSpacing: '0.6px',
      marginBottom: '8px',
      display: 'block',
    },
    navLink: (active: boolean): CSSProperties => ({
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: isMobile || isOpen ? '12px 14px' : '12px 0',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: active ? '750' : '600',
      borderRadius: '14px',
      color: active ? '#0f172a' : '#475569',
      background: active ? 'linear-gradient(135deg, #ffffff, #eaf4ff)' : 'transparent',
      border: active ? '1px solid rgba(37, 99, 235, 0.16)' : '1px solid transparent',
      boxShadow: active ? '0 12px 24px rgba(37, 99, 235, 0.10)' : 'none',
      transition: 'transform 0.18s ease, background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease',
      marginBottom: '4px',
      minHeight: '44px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      justifyContent: isMobile || isOpen ? 'flex-start' : 'center',
    }),
    badge: (color: string): CSSProperties => ({
      marginLeft: 'auto',
      padding: '2px 6px',
      fontSize: '9px',
      fontWeight: '700',
      borderRadius: '999px',
      background: color === 'red' ? '#fee2e2' : '#e0e7ff',
      color: color === 'red' ? '#ef4444' : '#4338ca',
    }),
    adminBox: {
      marginTop: 'auto',
      padding: '18px',
      borderTop: '1px solid rgba(148, 163, 184, 0.18)',
      background: 'rgba(255, 255, 255, 0.74)',
    },
    adminHint: {
      margin: '0 0 12px 0',
      fontSize: '12px',
      lineHeight: 1.45,
      color: '#64748b',
    },
    adminEyebrow: {
      display: 'block',
      marginBottom: '3px',
      fontSize: '11px',
      fontWeight: '800',
      color: '#0f766e',
      textTransform: uppercase,
      letterSpacing: '0.6px',
    },
    adminBtn: {
      display: 'block',
      padding: '13px',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      textAlign: 'center' as 'center',
      background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
      color: '#fff',
      borderRadius: '14px',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 14px 28px rgba(15, 23, 42, 0.24)',
    }
  } satisfies Record<string, CSSProperties | ((active: boolean) => CSSProperties) | ((color: string) => CSSProperties)>;

  return (
    <>
      {/* Менюну ачуу/жабуу баскычы */}
      <button style={s.burgerBtn} onClick={toggleMenu} className="burger-btn" aria-label="Менюну ачуу">
        <div style={{...s.line, transform: isOpen ? 'rotate(45deg) translateY(8.5px)' : 'none'}}></div>
        <div style={{...s.line, opacity: isOpen ? 0 : 1}}></div>
        <div style={{...s.line, transform: isOpen ? 'rotate(-45deg) translateY(-8.5px)' : 'none'}}></div>
      </button>

      {/* Көлөкө (Overlay) */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
            style={s.overlay}
          />
        )}
      </AnimatePresence>

      {/* Сайдбар */}
      <motion.aside 
        className={`sidebar-nav ${!isMobile && !isOpen ? 'collapsed' : ''}`}
        style={s.sidebar}
        initial={{ x: isMobile ? '-100%' : 0 }}
        animate={{ x: isMobile ? (isOpen ? 0 : '-100%') : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <Link to="/" style={s.logoContainer}>
          <div style={s.logoIcon}>🏫</div>
          <div style={s.logoCopy} className="logo-copy">
            <span style={s.logoText}>З.Ормонов</span>
            <span style={s.logoMeta}>Мектеп порталы</span>
          </div>
        </Link>

        {/* НЕГИЗГИ */}
        <div style={s.menuSection}>
          <span style={s.sectionTitle} className="section-title">Негизги</span>
          <Link to="/" style={s.navLink(isActive('/'))} className={navClass('/')} title="Башкы бет"><span className="nav-icon">🏠</span><span className="nav-label">Башкы бет</span></Link>
          <Link to="/about" style={s.navLink(isActive('/about'))} className={navClass('/about')} title="Биз жөнүндө"><span className="nav-icon">📖</span><span className="nav-label">Биз жөнүндө</span></Link>
          <Link to="/news" style={s.navLink(isActive('/news'))} className={navClass('/news')} title="Жаңылыктар"><span className="nav-icon">📰</span><span className="nav-label">Жаңылыктар</span></Link>
          <Link to="/schedule" style={s.navLink(isActive('/schedule'))} className={navClass('/schedule')} title="Расписание"><span className="nav-icon">📅</span><span className="nav-label">Расписание</span></Link>
        </div>

        {/* БИЛИМ & IT */}
        <div style={s.menuSection}>
          <span style={s.sectionTitle} className="section-title">Билим & IT</span>
          <Link to="/community/ort" style={s.navLink(isActive('/community/ort'))} className={navClass('/community/ort')} title="ORT даярдоо"><span className="nav-icon">📚</span><span className="nav-label">ORT даярдоо</span></Link>
          <Link to="/community/js-game" style={s.navLink(isActive('/community/js-game'))} className={navClass('/community/js-game')} title="Frontend">
            <span className="nav-icon">🧑‍💻</span><span className="nav-label">Frontend</span> <span className="nav-badge" style={s.badge('red')}>ХИТ</span>
          </Link>
          <Link to="/community/python-course" style={s.navLink(isActive('/community/python-course'))} className={navClass('/community/python-course')} title="Python"><span className="nav-icon">🐍</span><span className="nav-label">Python</span></Link>
          <Link to="/community/ai-course" style={s.navLink(isActive('/community/ai-course'))} className={navClass('/community/ai-course')} title="AI үйрөнүү">
            <span className="nav-icon">🕹️</span><span className="nav-label">AI үйрөнүү</span> <span className="nav-badge" style={s.badge('blue')}>ЖАҢЫ</span>
          </Link>
          <Link to="/resources" style={s.navLink(isActive('/resources'))} className={navClass('/resources')} title="Пайдалуу ресурстар"><span className="nav-icon">🔗</span><span className="nav-label">Пайдалуу ресурстар</span></Link>
        </div>

        {/* КООМЧУЛУК */}
        <div style={s.menuSection}>
          <span style={s.sectionTitle} className="section-title">Коомчулук</span>
          <Link to="/community/warm-words" style={s.navLink(isActive('/community/warm-words'))} className={navClass('/community/warm-words')} title="Анонимдүү сөздөр"><span className="nav-icon">💌</span><span className="nav-label">Анонимдүү сөздөр</span></Link>
          <Link to="/community/duel-game" style={s.navLink(isActive('/community/duel-game'))} className={navClass('/community/duel-game')} title="Ким акылдуу?"><span className="nav-icon">🧠</span><span className="nav-label">Ким акылдуу?</span></Link>
          <Link to="/community/math-sprint" style={s.navLink(isActive('/community/math-sprint'))} className={navClass('/community/math-sprint')} title="Тез Эсепте"><span className="nav-icon">🧮</span><span className="nav-label">Тез Эсепте</span></Link>
        </div>

        {/* МЕКТЕП */}
        <div style={s.menuSection}>
          <span style={s.sectionTitle} className="section-title">Мектеп</span>
          <Link to="/teachers" style={s.navLink(isActive('/teachers'))} className={navClass('/teachers')} title="Мугалимдер"><span className="nav-icon">👨‍🏫</span><span className="nav-label">Мугалимдер</span></Link>
          <Link to="/best-students" style={s.navLink(isActive('/best-students'))} className={navClass('/best-students')} title="Мыкты окуучулар"><span className="nav-icon">🏆</span><span className="nav-label">Мыкты окуучулар</span></Link>
          <Link to="/gallery" style={s.navLink(isActive('/gallery'))} className={navClass('/gallery')} title="Галерея"><span className="nav-icon">📸</span><span className="nav-label">Галерея</span></Link>
          <Link to="/library" style={s.navLink(isActive('/library'))} className={navClass('/library')} title="Иш пландар"><span className="nav-icon">📄</span><span className="nav-label">Иш пландар</span></Link>
          <Link to="/contact" style={s.navLink(isActive('/contact'))} className={navClass('/contact')} title="Байланыш"><span className="nav-icon">📞</span><span className="nav-label">Байланыш</span></Link>
        </div>

        <div style={s.adminBox} className="admin-box">
          <p style={s.adminHint}>
            <span style={s.adminEyebrow}>Башкаруу</span>
            Жаңылыктарды жана мектеп маалыматтарын жаңыртуу.
          </p>
          <Link to="/admin-panel" style={s.adminBtn} className="admin-link">Админ панель</Link>
        </div>
      </motion.aside>

      <style>{`
        @media (min-width: 1024px) {
          .burger-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 18px 34px rgba(37, 99, 235, 0.34) !important;
          }

          .nav-icon {
            flex: 0 0 auto;
            font-size: 20px;
            line-height: 1;
          }

          .nav-label {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .sidebar-nav.collapsed .logo-copy,
          .sidebar-nav.collapsed .section-title,
          .sidebar-nav.collapsed .admin-box,
          .sidebar-nav.collapsed .nav-label,
          .sidebar-nav.collapsed .nav-badge {
            display: none !important;
          }

          .sidebar-nav.collapsed .nav-link:hover {
            transform: translateX(0) !important;
          }
        }

        .nav-link:hover {
          transform: translateX(4px);
          background: #ffffff !important;
          color: #0f172a !important;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08) !important;
        }

        .nav-link.active::before {
          content: "";
          position: absolute;
          left: 6px;
          top: 50%;
          width: 4px;
          height: 22px;
          border-radius: 999px;
          background: linear-gradient(180deg, #2563eb, #14b8a6);
          transform: translateY(-50%);
        }

        .admin-link:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
};

export default Header;
