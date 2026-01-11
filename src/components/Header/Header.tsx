import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown үчүн

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={styles.logo}
        >
          <Link to="/">
            🏫 Зайил Ормонов
          </Link>
        </motion.div>

        {/* Компьютердик меню */}
        <nav className={styles.desktopNav}>
          <Link to="/">Башкы бет</Link>
          <Link to="/about">Биз жөнүндө</Link>
          
          {/* Dropdown Меню башталды */}
          <div 
            className={styles.dropdown}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <span className={styles.dropdownLabel}>Биздин жамаат ▾</span>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={styles.dropdownContent}
                >
                  <Link to="/teachers">Биздин Мугалимдер</Link>
                  <Link to="/best-students">Биздин Мыкты Окуучулар</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Dropdown Меню бүттү */}

          <Link to="/news">Жаңылыктар</Link>
          <Link to="/contact">Байланыш</Link>
          <Link to="/schedule">Расписание</Link>
          <Link to="admin-panel">Админ</Link>
        </nav>

        {/* Гамбургер баскычы */}
        <button className={styles.burger} onClick={toggleMenu}>
          <div className={`${styles.line} ${isOpen ? styles.open1 : ''}`}></div>
          <div className={`${styles.line} ${isOpen ? styles.open2 : ''}`}></div>
          <div className={`${styles.line} ${isOpen ? styles.open3 : ''}`}></div>
        </button>

        {/* Мобилдик меню */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className={styles.mobileNav}
            >
              <Link to="admin-panel" onClick={toggleMenu}>Админ</Link>
              <Link to="/" onClick={toggleMenu}>Башкы бет</Link>
              <Link to="/about" onClick={toggleMenu}>Биз жөнүндө</Link>
              <Link to="/teachers" onClick={toggleMenu}>Биздин Мугалимдер</Link>
              <Link to="/best-students" onClick={toggleMenu}>Биздин Мыкты Окуучулар</Link>
              <Link to="/schedule" onClick={toggleMenu}>Расписание</Link>
              <Link to="/news" onClick={toggleMenu}>Жаңылыктар</Link>
              <Link to="/contact" onClick={toggleMenu}>Байланыш</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;