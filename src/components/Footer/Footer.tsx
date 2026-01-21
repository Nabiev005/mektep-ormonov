import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react'; // Иконкаларды импорттоо
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 1. Блок: Логотип */}
        <div className={styles.about}>
          <h2 className={styles.logo}>🏫 Зайил Ормонов</h2>
          <p>
            Биздин мектеп — келечектеги лидерлерди жана кесипкөй адистерди 
            даярдоочу билим ордосу. 1924-жылдан бери сапаттуу билим берип келебиз.
          </p>
        </div>

        {/* 2. Блок: Пайдалуу шилтемелер */}
        <div className={styles.links}>
          <h3>Шилтемелер</h3>
          <ul>
            <li><Link to="/">Башкы бет</Link></li>
            <li><Link to="/about">Биз жөнүндө</Link></li>
            <li><Link to="/news">Жаңылыктар</Link></li>
            <li><Link to="/schedule">Расписание</Link></li>
          </ul>
        </div>

        {/* 3. Блок: Байланыш */}
        <div className={styles.contact}>
          <h3>Байланыш</h3>
          <p><MapPin size={18} /> Баткен району, Кан айылы.</p>
          <p><Phone size={18} /> +996 770 125 632</p>
          <p><Mail size={18} /> info@mektep.kg</p>
          
          <div className={styles.socials}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <Instagram size={24} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <Facebook size={24} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p>© 2026 Бардык укуктар корголгон. Менин Мектебим.</p>
      </div>
    </footer>
  );
};

export default Footer;