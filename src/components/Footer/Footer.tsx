import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, ArrowUpRight, Send } from 'lucide-react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.mainWrapper}>
        <div className={styles.glassContainer}>
          <div className={styles.grid}>
            
            {/* 1. Брендинг жана Миссия */}
            <div className={styles.brandSection}>
              <div className={styles.logoWrapper}>
                <span className={styles.logoIcon}>🏫</span>
                <h2 className={styles.logoText}>Зайил Ормонов</h2>
              </div>
              <p className={styles.description}>
                Биздин мектеп 1924-жылдан бери келечектеги лидерлерди жана кесипкөй адистерди 
                даярдап келет. Сапаттуу билим — биздин башкы максатыбыз.
              </p>
              <div className={styles.socialGroup}>
                <a href="https://www.instagram.com/kg.mektep?igsh=MWRnbXlscmFucXBidA==" className={styles.socialCircle}><Instagram size={20} /></a>
                <a href="https://www.facebook.com/profile.php?id=61586219777150" className={styles.socialCircle}><Facebook size={20} /></a>
                <Link to="/community/media-center" className={styles.socialCircle}><Youtube size={20} /></Link>
              </div>
            </div>

            {/* 2. Тез шилтемелер */}
            <div className={styles.linksSection}>
              <h3 className={styles.heading}>Пайдалуу бөлүмдөр</h3>
              <ul className={styles.linkList}>
                <li><Link to="/"><ArrowUpRight size={14} /> Башкы бет</Link></li>
                <li><Link to="/about"><ArrowUpRight size={14} /> Биз жөнүндө</Link></li>
                <li><Link to="/news"><ArrowUpRight size={14} /> Жаңылыктар</Link></li>
                <li><Link to="/schedule"><ArrowUpRight size={14} /> Расписание</Link></li>
              </ul>
            </div>

            {/* 3. Байланыш жана Newsletter */}
            <div className={styles.contactSection}>
              <h3 className={styles.heading}>Байланышуу</h3>
              <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                  <MapPin size={18} className={styles.accentIcon} />
                  <span>Баткен району Алтын-Бешик аймагы, Кан айылы</span>
                </div>
                <div className={styles.infoItem}>
                  <Phone size={18} className={styles.accentIcon} />
                  <span>+996 770 125 632</span>
                </div>
                <div className={styles.infoItem}>
                  <Mail size={18} className={styles.accentIcon} />
                  <span>maadali.isamidinuulu@bk.ru</span>
                </div>
              </div>

              <div className={styles.subscribeBox}>
                <input type="email" placeholder="E-mail дарегиңиз..." />
                <button className={styles.sendBtn}><Send size={18} /></button>
              </div>
            </div>

          </div>

          <div className={styles.divider}></div>

          <div className={styles.bottomBar}>
            <p>© {new Date().getFullYear()} Зайил Ормонов атындагы жалпы билим берүү мектеби мекемеси. Бардык укуктар корголгон. Сайт Автору: Набиев Айбек</p>
            <div className={styles.legalLinks}>
              <Link to="/contact">Купуялуулук</Link>
              <Link to="/resources">Эрежелер</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
