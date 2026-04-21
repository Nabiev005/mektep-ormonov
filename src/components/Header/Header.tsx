/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsOpen(!isOpen);

  // Баракча алмашканда менюну жабуу
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Меню ачылганда арткы фонду жылдырбоо
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const s = {
    burgerBtn: {
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      position: 'fixed' as 'fixed',
      top: '15px',
      left: '15px',
      zIndex: 4000,
      background: '#2563eb',
      border: 'none',
      borderRadius: '8px',
      padding: '10px',
      cursor: 'pointer',
      display: 'flex',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      flexDirection: 'column' as 'column',
      gap: '4px',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
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
      width: '280px',
      background: '#fff',
      borderRight: '1px solid #f1f5f9',
      display: 'flex',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      flexDirection: 'column' as 'column',
      zIndex: 5000,
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      overflowY: 'auto' as 'auto',
      fontFamily: '"Inter", sans-serif',
    },
    overlay: {
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      position: 'fixed' as 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 4500,
    },
    logoContainer: {
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      textDecoration: 'none',
    },
    logoText: {
      fontSize: '22px',
      fontWeight: '800',
      color: '#0f172a',
    },
    menuSection: {
      padding: '0 12px 20px 12px',
    },
    sectionTitle: {
      padding: '0 12px',
      fontSize: '11px',
      fontWeight: '700',
      color: '#94a3b8',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      textTransform: 'uppercase' as 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
      display: 'block',
    },
    navLink: (active: boolean) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 14px',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '10px',
      color: active ? '#2563eb' : '#64748b',
      background: active ? '#eff6ff' : 'transparent',
      transition: '0.2s',
      marginBottom: '4px',
    }),
    badge: (color: string) => ({
      marginLeft: 'auto',
      padding: '2px 6px',
      fontSize: '9px',
      fontWeight: '700',
      borderRadius: '6px',
      background: color === 'red' ? '#fee2e2' : '#e0e7ff',
      color: color === 'red' ? '#ef4444' : '#4338ca',
    }),
    adminBox: {
      marginTop: 'auto',
      padding: '20px',
      borderTop: '1px solid #f1f5f9',
    },
    adminBtn: {
      display: 'block',
      padding: '12px',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      textAlign: 'center' as 'center',
      background: '#0f172a',
      color: '#fff',
      borderRadius: '10px',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '600',
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <>
      {/* Бургер баскычы - мобилдикте гана */}
      <button style={s.burgerBtn} onClick={toggleMenu} className="burger-btn">
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
        className="sidebar-nav"
        style={s.sidebar}
        initial={isMobile ? { x: '-100%' } : { x: 0 }}
        animate={isMobile ? { x: isOpen ? 0 : '-100%' } : { x: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <Link to="/" style={s.logoContainer}>
          <div style={{background: '#2563eb', padding: '6px', borderRadius: '8px', color: '#fff'}}>🏢</div>
          <span style={s.logoText}>З.Ормонов</span>
        </Link>

        {/* НЕГИЗГИ */}
        <div style={s.menuSection}>
          <span style={s.sectionTitle}>Негизги</span>
          <Link to="/" style={s.navLink(isActive('/'))}>🏠 Башкы бет</Link>
          <Link to="/about" style={s.navLink(isActive('/about'))}>📖 Биз жөнүндө</Link>
          <Link to="/news" style={s.navLink(isActive('/news'))}>📰 Жаңылыктар</Link>
          <Link to="/schedule" style={s.navLink(isActive('/schedule'))}>📅 Расписание</Link>
        </div>

        {/* БИЛИМ & IT */}
        <div style={s.menuSection}>
          <span style={s.sectionTitle}>Билим & IT</span>
          <Link to="/community/ort" style={s.navLink(isActive('/community/ort'))}>📚 ORT даярдоо</Link>
          <Link to="/community/js-game" style={s.navLink(isActive('/community/js-game'))}>
            🧑‍💻 Frontend <span style={s.badge('red')}>ХИТ</span>
          </Link>
          <Link to="/community/python-course" style={s.navLink(isActive('/community/python-course'))}>🐍 Python</Link>
          <Link to="/community/ai-course" style={s.navLink(isActive('/community/ai-course'))}>
            🕹️ AI үйрөнүү <span style={s.badge('blue')}>ЖАҢЫ</span>
          </Link>
          <Link to="/resources" style={s.navLink(isActive('/resources'))}>🔗 Пайдалуу ресурстар</Link>
        </div>

        {/* КООМЧУЛУК */}
        <div style={s.menuSection}>
          <span style={s.sectionTitle}>Коомчулук</span>
          <Link to="/community/warm-words" style={s.navLink(isActive('/community/warm-words'))}>💌 Анонимдүү сөздөр</Link>
          <Link to="/community/duel-game" style={s.navLink(isActive('/community/duel-game'))}>🧠 Ким акылдуу?</Link>
          <Link to="/community/math-sprint" style={s.navLink(isActive('/community/math-sprint'))}>🧮 Тез Эсепте</Link>
        </div>

        {/* МЕКТЕП */}
        <div style={s.menuSection}>
          <span style={s.sectionTitle}>Мектеп</span>
          <Link to="/teachers" style={s.navLink(isActive('/teachers'))}>👨‍🏫 Мугалимдер</Link>
          <Link to="/best-students" style={s.navLink(isActive('/best-students'))}>🏆 Мыкты окуучулар</Link>
          <Link to="/gallery" style={s.navLink(isActive('/gallery'))}>📸 Галерея</Link>
          <Link to="/library" style={s.navLink(isActive('/library'))}>📚 Китепкана</Link>
          <Link to="/contact" style={s.navLink(isActive('/contact'))}>📞 Байланыш</Link>
        </div>

        <div style={s.adminBox}>
          <Link to="/admin-panel" style={s.adminBtn}>Админ панель</Link>
        </div>
      </motion.aside>

      <style>{`
        @media (min-width: 1024px) {
          .burger-btn { display: none !important; }
          .sidebar-nav { transform: none !important; }
        }
      `}</style>
    </>
  );
};

export default Header;