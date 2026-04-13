/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const location = useLocation();

  // Баракча алмашканда менюну жабуу
  useEffect(() => {
    setIsOpen(false);
    setActiveSub(null);
    document.body.style.overflow = 'unset';
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      document.body.style.overflow = 'unset';
    } else {
      document.body.style.overflow = 'hidden';
    }
  };

  // Стилдер (Inline CSS)
  const s = {
    header: {
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      position: 'sticky' as 'sticky',
      top: 0,
      zIndex: 2000,
      height: '70px',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      fontFamily: 'sans-serif',
    },
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logo: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#fff',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    burger: {
      background: '#2563eb', // Көк түс
      border: 'none',
      borderRadius: '8px',
      padding: '10px',
      cursor: 'pointer',
      display: 'flex',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      flexDirection: 'column' as 'column',
      gap: '4px',
      zIndex: 3000,
    },
    line: (open: boolean, rotate: number, y: number) => ({
      width: '20px',
      height: '2px',
      background: '#fff',
      transition: 'all 0.3s',
      transform: open ? `translateY(${y}px) rotate(${rotate}deg)` : 'none',
      opacity: open && rotate === 0 ? 0 : 1,
    }),
    sidebar: {
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '300px',
      height: '100vh',
      background: 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)', // Кочкул көк градиент
      zIndex: 2500,
      padding: '80px 20px 40px 20px',
      boxShadow: '5px 0 30px rgba(0,0,0,0.5)',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      overflowY: 'auto' as 'auto',
    },
    overlay: {
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      position: 'fixed' as 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 2400,
    },
    navLink: {
      display: 'block',
      padding: '12px 15px',
      color: '#fff',
      textDecoration: 'none',
      fontSize: '1rem',
      borderRadius: '10px',
      marginBottom: '5px',
      background: 'rgba(255,255,255,0.05)',
      transition: '0.3s',
    },
    subSection: {
      marginLeft: '15px',
      paddingLeft: '15px',
      borderLeft: '1px solid rgba(255,255,255,0.2)',
      marginBottom: '10px',
    },
    subTitle: {
      color: '#93c5fd',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      textTransform: 'uppercase' as 'uppercase',
      margin: '15px 0 8px 0',
      display: 'block',
    }
  };

  return (
    <header style={s.header}>
      <div style={s.container}>
        {/* Сол жактагы Бургер баскычы */}
        <button style={s.burger} onClick={toggleMenu}>
          <div style={s.line(isOpen, 45, 6)}></div>
          <div style={s.line(isOpen, 0, 0)}></div>
          <div style={s.line(isOpen, -45, -6)}></div>
        </button>

        {/* Логотип */}
        <Link to="/" style={s.logo}>
          <span>🏫</span>
          <span>Зайил Ормонов</span>
        </Link>

        {/* Админ баскычы оң жакта */}
        <Link to="/admin-panel" style={{...s.navLink, background: '#ef4444', fontSize: '0.8rem', marginBottom: 0}}>
          Админ
        </Link>
      </div>

      {/* Оверлей (көлөкө) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
            style={s.overlay}
          />
        )}
      </AnimatePresence>

      {/* Сол жактагы Көк Меню (Sidebar) */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={s.sidebar}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to="/" style={s.navLink}>🏠 Башкы бет</Link>
              <Link to="/about" style={s.navLink}>📖 Биз жөнүндө</Link>
              <Link to="/news" style={s.navLink}>📰 Жаңылыктар</Link>
              
              <span style={s.subTitle}>🚀 Билим & IT</span>
              <div style={s.subSection}>
                <Link to="/community/ort" style={s.navLink}>📚 ORT даярдоо</Link>
                <Link to="/community/js-game" style={s.navLink}>🧑‍💻 Frontend</Link>
                <Link to="/community/python-course" style={s.navLink}>🐍 Python</Link>
                <Link to="/community/ai-course" style={s.navLink}>🕹️ AI үйрөнүү</Link>
                <Link to="/community/robot-lab" style={s.navLink}>🤖 Робот жасоо</Link>
              </div>

              <span style={s.subTitle}>🎮 Оюндар</span>
              <div style={s.subSection}>
                <Link to="/community/duel-game" style={s.navLink}>🧠 Ким акылдуу?</Link>
                <Link to="/community/math-sprint" style={s.navLink}>🧮 Тез Эсепте</Link>
                <Link to="/community/snake-game" style={s.navLink}>🐍 Билим Жыланы</Link>
              </div>

              <span style={s.subTitle}>Мектеп</span>
              <Link to="/teachers" style={s.navLink}>👨‍🏫 Мугалимдер</Link>
              <Link to="/best-students" style={s.navLink}>🌟 Мыкты окуучулар</Link>
              <Link to="/library" style={s.navLink}>📚 Китепкана</Link>
              <Link to="/gallery" style={s.navLink}>📸 Галерея</Link>
              <Link to="/contact" style={s.navLink}>📞 Байланыш</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;