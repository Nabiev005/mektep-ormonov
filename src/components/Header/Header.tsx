import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  // Баракча алмашса менюну жабуу
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : 'unset';
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.logo}
        >
          <Link to="/">
            <span className={styles.logoEmoji}>🏫</span>
            <span className={styles.logoText}>Зайил Ормонов</span>
          </Link>
        </motion.div>

        {/* Компьютердик меню */}
        <nav className={styles.desktopNav}>
          <Link to="/" className={location.pathname === '/' ? styles.active : ''}>Башкы бет</Link>
          <Link to="/about" className={location.pathname === '/about' ? styles.active : ''}>Биз жөнүндө</Link>
          
          <div 
            className={styles.dropdown}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <span className={`${styles.dropdownLabel} ${isDropdownOpen ? styles.labelActive : ''}`}>
              Жамаат ▾
            </span>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  className={styles.dropdownContent}
                >
                  <Link to="/teachers">Мугалимдер</Link>
                  <Link to="/best-students">Мыкты окуучулар</Link>
                  {/* ЖАҢЫ КОШУЛДУ */}
                  <Link to="/parents-corner">Ата-энелер бурчу</Link> 
                  <Link to="/gallery">📸 Мектеп галереясы</Link>
                  <Link to="/resources">Пайдалуу ресурстар</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/news" className={location.pathname === '/news' ? styles.active : ''}>Жаңылыктар</Link>
          <Link to="/schedule" className={location.pathname === '/schedule' ? styles.active : ''}>Расписание</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? styles.active : ''}>Байланыш</Link>
          <Link to="/admin-panel" className={styles.adminBtn}>Админ</Link>
        </nav>

        {/* Заманбап Бургер */}
        <button className={styles.burger} onClick={toggleMenu} aria-label="Меню">
          <div className={`${styles.line} ${isOpen ? styles.open1 : ''}`}></div>
          <div className={`${styles.line} ${isOpen ? styles.open2 : ''}`}></div>
          <div className={`${styles.line} ${isOpen ? styles.open3 : ''}`}></div>
        </button>

        {/* Мобилдик меню (Floating Card Style) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
              className={styles.mobileNav}
            >
              <div className={styles.mobileNavLinks}>
                <Link to="/">🏠 Башкы бет</Link>
                <Link to="/about">📖 Биз жөнүндө</Link>
                
                <div className={styles.mobileDivider}>Мектеп жашоосу</div>
                <Link to="/teachers">👨‍🏫 Мугалимдер</Link>
                <Link to="/best-students">🌟 Мыкты окуучулар</Link>
                {/* ЖАҢЫ КОШУЛДУ */}
                <Link to="/parents-corner">👨‍👩‍👧 Ата-энелер бурчу</Link> 
                <Link to="/resources">📚 Пайдалуу ресурстар</Link>
                <Link to="/gallery">📸 Мектеп галереясы</Link>
                
                <div className={styles.mobileDivider}>Маалымат</div>
                <Link to="/schedule">📅 Расписание</Link>
                <Link to="/news">📰 Жаңылыктар</Link>
                <Link to="/contact">📞 Байланыш</Link>
                
                <Link to="/admin-panel" className={styles.mobileAdminLink}>🔐 Админ панел</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;