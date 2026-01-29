/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGamesSubOpen, setIsGamesSubOpen] = useState(false);
  const [isITSubOpen, setIsITSubOpen] = useState(false); // Жаңы: IT үчүн state
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    setIsGamesSubOpen(false);
    setIsITSubOpen(false);
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
            onMouseLeave={() => {
              setIsDropdownOpen(false);
              setIsGamesSubOpen(false);
              setIsITSubOpen(false);
            }}
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
                  <Link to="/teachers">👨‍🏫 Мугалимдер</Link>
                  <Link to="/best-students">🌟 Мыкты окуучулар</Link>
                  <Link to="/community/media-center">🎙️ Медиа-борбор</Link>
                  <Link to="/community/warm-words">✨ Жылуу сөздөр дубалы</Link>

                  {/* IT ҮЙРӨНҮҮ БӨЛҮМҮ */}
                  <div 
                    className={styles.subDropdown}
                    onMouseEnter={() => { setIsITSubOpen(true); setIsGamesSubOpen(false); }}
                    onMouseLeave={() => setIsITSubOpen(false)}
                  >
                    <div className={`${styles.subDropdownLabel} ${isITSubOpen ? styles.subActive : ''}`}>
                      🚀 IT үйрөнүү <span className={styles.arrow}>▸</span>
                    </div>
                    <AnimatePresence>
                      {isITSubOpen && (
                        <motion.div 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className={styles.subDropdownContent}
                        >
                          <Link to="/community/js-game">🧑‍💻 Frontend үйрөнүү</Link>
                          <Link to="/community/robot-lab">🤖 Робот жасоо</Link>
                          <Link to="/community/python-course">🐍 Python үйрөнүү</Link>
                          <Link to="/community/ai-course">🕹️ AI үйрөнүү</Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ОКУУЧУЛАР ҮЧҮН ОЮНДАР */}
                  <div 
                    className={styles.subDropdown}
                    onMouseEnter={() => { setIsGamesSubOpen(true); setIsITSubOpen(false); }}
                    onMouseLeave={() => setIsGamesSubOpen(false)}
                  >
                    <div className={`${styles.subDropdownLabel} ${isGamesSubOpen ? styles.subActive : ''}`}>
                      🎮 Интеллектуалдык оюндар <span className={styles.arrow}>▸</span>
                    </div>
                    <AnimatePresence>
                      {isGamesSubOpen && (
                        <motion.div 
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className={styles.subDropdownContent}
                        >
                          <Link to="/community/duel-game">🧠 Ким акылдуу?</Link>
                          <Link to="/community/apricot-tree">🌳 Өрүк дарагы</Link>
                          <Link to="/community/snake-game">🐍 Билим Жыланы</Link>
                          <Link to="/community/math-sprint">🧮 Тез Эсепте</Link>
                          <Link to="/community/games/geo-master">🌍 Гео Мастер</Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link to="/library">📚 Китепкана</Link>
                  <Link to="/parents-corner">👨‍👩‍👧‍👦 Ата-энелер бурчу</Link> 
                  <Link to="/gallery">📸 Мектеп галереясы</Link>
                  <Link to="/resources">🔗 Пайдалуу ресурстар</Link>
                  <Link to="/online-lessons">🎥 Онлайн сабактар</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/news" className={location.pathname === '/news' ? styles.active : ''}>Жаңылыктар</Link>
          <Link to="/schedule" className={location.pathname === '/schedule' ? styles.active : ''}>Расписание</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? styles.active : ''}>Байланыш</Link>
          <Link to="/admin-panel" className={styles.adminBtn}>Админ</Link>
        </nav>

        {/* Бургер баскычы */}
        <button className={styles.burger} onClick={toggleMenu} aria-label="Меню">
          <div className={`${styles.line} ${isOpen ? styles.open1 : ''}`}></div>
          <div className={`${styles.line} ${isOpen ? styles.open2 : ''}`}></div>
          <div className={`${styles.line} ${isOpen ? styles.open3 : ''}`}></div>
        </button>

        {/* Мобилдик меню */}
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
                
                <div className={styles.mobileDivider}>IT & Билим</div>
                <div className={styles.mobileSubSection}>
                   <span className={styles.mobileSubTitle}>🚀 IT үйрөнүү:</span>
                   <Link to="/community/js-game">🧑‍💻 Frontend үйрөнүү</Link>
                   <Link to="/community/robot-lab">🤖 Робот жасоо</Link>
                   <Link to="/community/python-course">🐍 Python үйрөнүү</Link>
                   <Link to="/community/ai-course">🕹️ AI үйрөнүү</Link>
                </div>

                <div className={styles.mobileSubSection}>
                   <span className={styles.mobileSubTitle}>🎮 Окуучулар үчүн оюндар:</span>
                   <Link to="/community/duel-game">🧠 Ким акылдуу?</Link>
                   <Link to="/community/apricot-tree">🌳 Өрүк дарагы</Link>
                   <Link to="/community/snake-game">🐍 Билим Жыланы</Link>
                   <Link to="/community/math-sprint">🧮 Тез Эсепте</Link>
                   <Link to="/community/games/geo-master">🌍 Гео Мастер</Link>
                </div>

                <div className={styles.mobileDivider}>Мектеп жашоосу</div>
                <Link to="/teachers">👨‍🏫 Мугалимдер</Link>
                <Link to="/best-students">🌟 Мыкты окуучулар</Link>
                <Link to="/community/media-center">🎙️ Медиа-борбор</Link>
                <Link to="/library">📚 Китепкана</Link> 
                
                <div className={styles.mobileDivider}>Маалымат</div>
                <Link to="/news">📰 Жаңылыктар</Link>
                <Link to="/contact">📞 Байланыш</Link>
                
                <Link to="/admin-panel" className={styles.mobileAdminLink}>🔐 Админ</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;