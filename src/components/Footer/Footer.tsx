import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import styles from './Footer.module.css';

const SCHOOL_LINKS = [
  { label: 'Биз жөнүндө', path: '/about' },
  { label: 'Жаңылыктар', path: '/news' },
  { label: 'Расписание', path: '/schedule' },
  { label: 'Мугалимдер', path: '/teachers' },
];

const STUDENT_LINKS = [
  { label: 'Окуучу панели', path: '/student-panel' },
  { label: 'ЖРТга даярдык', path: '/community/ort' },
  { label: 'Онлайн сабактар', path: '/online-lessons' },
  { label: 'Ата-энелер бурчу', path: '/parents-corner' },
];

const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>ЗО</span>
          <strong>Зайил Ормонов атындагы мектеп</strong>
        </div>
        <p>Баткен району, Кан айылындагы жалпы билим берүү мектеби. Сапаттуу билим жана татыктуу тарбия — биздин башкы максатыбыз.</p>
        <div className={styles.social}>
          <a href="https://www.instagram.com/kg.mektep?igsh=MWRnbXlscmFucXBidA==" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>
          <a href="https://www.facebook.com/profile.php?id=61586219777150" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={18} /></a>
          <Link to="/community/media-center" aria-label="Медиа-борбор"><Youtube size={18} /></Link>
        </div>
      </div>

      <nav className={styles.column} aria-label="Мектеп">
        <h3>Мектеп</h3>
        {SCHOOL_LINKS.map((link) => <Link key={link.path} to={link.path}>{link.label}</Link>)}
      </nav>

      <nav className={styles.column} aria-label="Окуучуларга">
        <h3>Окуучуларга</h3>
        {STUDENT_LINKS.map((link) => <Link key={link.path} to={link.path}>{link.label}</Link>)}
      </nav>

      <div className={styles.column}>
        <h3>Байланыш</h3>
        <span className={styles.contact}><MapPin size={16} /> Баткен району, Алтын-Бешик аймагы, Кан айылы</span>
        <a className={styles.contact} href="tel:+996770125632"><Phone size={16} /> +996 770 125 632</a>
        <a className={styles.contact} href="mailto:maadali.isamidinuulu@bk.ru"><Mail size={16} /> maadali.isamidinuulu@bk.ru</a>
      </div>
    </div>

    <div className={styles.bottom}>
      <span>© {new Date().getFullYear()} Зайил Ормонов атындагы жалпы билим берүү мектеби</span>
      <span>Сайттын автору: Набиев Айбек</span>
    </div>
  </footer>
);

export default Footer;
