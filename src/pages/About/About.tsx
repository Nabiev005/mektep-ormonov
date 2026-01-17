import React from 'react';
import { motion } from 'framer-motion';
import Hom from "../../assets/Home.jpg";
import ZayilPhoto from "../../assets/ormonov.png";
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className={styles.aboutPage}
    >
      {/* 1. Бөлүм: Мектептин тарыхы - КАРТОЧКА СТИЛИНДЕ */}
      <section className={styles.intro}>
        <div className={styles.container}>
          <motion.h1 
            initial={{ y: -20 }} 
            animate={{ y: 0 }} 
            className={styles.title}
          >
            Биздин тарых жана миссия
          </motion.h1>

          <div className={styles.historyCard}>
            <div className={styles.historyInfo}>
              <span className={styles.scrollLabel}>Биздин мектеп</span>
              <h2>Мектептин негизделиши</h2>
              <p>
                Зайил Ормонов атындагы орто мектеп заман талабына ылайык жаңы имаратта
                2015–2017-жылдары республикалык бюджеттин эсебинен курулуп, пайдаланууга берилген.
                Жаңы мектеп имараты 1936-жылы курулган эски имараттын ордуна салынган.
              </p>
              <div className={styles.divider}></div>
              <h2>Мүмкүнчүлүктөр</h2>
              <p>
                Мектеп 225 окуучуга ылайыкташтырылган. Имаратта заманбап окуу класстары, 
                спорт залы, ашкана жана окуучулар үчүн коопсуз, жагымдуу билим берүү шарттары түзүлгөн.
              </p>
            </div>
            <div className={styles.historyImageWrapper}>
              <img src={Hom} alt="Мектеп имараты" />
            </div>
          </div>
        </div>
      </section>

      {/* --- ЖАҢЫ КОШУЛГАН БӨЛҮМ: Зайил Ормоновдун биографиясы --- */}
      <section className={styles.biographySection}>
        <div className={styles.container}>
          <div className={styles.bioCard}>
            <div className={styles.bioImageWrapper}>
              <div className={styles.bioPlaceholder}>
                <img src={ZayilPhoto} alt="Зайил Ормонов" />
              </div>
            </div>
            <div className={styles.bioInfo}>
              <span className={styles.scrollLabel}>Инсандык мурас</span>
              <h2 className={styles.bioName}>Зайил Ормонов</h2>
              <p className={styles.bioDescription}>
                Зайил Ормонов — агартуучулукка өмүрүн арнаган инсан. Ал Кан айылынын 
                билим берүү тармагынын түптөлүшүнө зор салым кошуп, бир нече муундарга 
                татыктуу тарбия берген. Анын ак эмгеги жана коомго кошкон салымы үчүн 
                мектепке анын ысымы ыйгарылган.
              </p>
              <div className={styles.bioFeatures}>
                <div className={styles.featureItem}>
                  <strong>Максаты:</strong> Айыл жаштарын сабаттуу жана мекенчил кылып тарбиялоо.
                </div>
                <div className={styles.featureItem}>
                  <strong>Мурасы:</strong> Билим алууга болгон умтулуу жана эмгекчилдик.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Бөлүм: Биздин баалуулуктар */}
      <section className={styles.values}>
        <div className={styles.container}>
          <h2 className={styles.subTitle}>Биздин баалуулуктар</h2>
          <div className={styles.valuesGrid}>
            <motion.div whileHover={{ scale: 1.05 }} className={styles.valueCard}>
              <div className={styles.icon}>🎓</div>
              <h3>Сапаттуу билим</h3>
              <p>Биз терең жана заманбап билим берүү стандарттарын карманабыз.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className={styles.valueCard}>
              <div className={styles.icon}>🤝</div>
              <h3>Биримдик</h3>
              <p>Мугалимдер, окуучулар жана ата-энелер бирдиктүү командабыз.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className={styles.valueCard}>
              <div className={styles.icon}>🚀</div>
              <h3>Инновация</h3>
              <p>Окутуу процессинде эң акыркы технологияларды колдонобуз.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;