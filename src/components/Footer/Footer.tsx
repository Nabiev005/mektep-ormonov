import React from 'react';
import { Link } from 'react-router-dom';
// import { motion,  } from 'framer-motion';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 1. Блок: Логотип жана кыскача маалымат */}
        <div className={styles.about}>
          <h2 className={styles.logo}>🏫 Зайил Ормонов</h2>
          <p>
            Биздин мектеп — келечектеги лидерлерди жана кесипкөй адистерди 
            даярдоочу билим ордосу. 1995-жылдан бери сапаттуу билим берип келебиз.
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
          <p>📍 Баткен район, Дара аймагы Кан айылы.</p>
          <p>📞 +996 702 952 200</p>
          <p>📧 info@mektep.kg</p>
          <div className={styles.socials}>
            <span>Instagram</span>
            <span>Facebook</span>
            <span>YouTube</span>
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