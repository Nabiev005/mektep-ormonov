import React from 'react';
import { motion } from 'framer-motion';
import Hom from "../../assets/Home.jpg"
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className={styles.aboutPage}
    >
      {/* 1. Бөлүм: Мектептин тарыхы */}
      <section className={styles.intro}>
        <div className={styles.container}>
          <motion.h1 
            initial={{ y: -20 }} 
            animate={{ y: 0 }} 
            className={styles.title}
          >
            Биздин тарых жана миссия
          </motion.h1>
          <div className={styles.contentWrapper}>
            <div className={styles.textBlock}>
              <h2>Мектептин негизделиши</h2>
              <p>
                    Жаңы мектептин курулушу жана ачылышы
                    Баткен районунун Кан айылында орто мектеп заман талабына ылайык жаңы имаратта 2015-2017 жылдары курулуп бүттү. Курулуш 2015-жылы башталган жана республикалык бюджеттен акча бөлүнүп жасалган.
                    Бул жаңы имарат эски мектептин ордуна курулган — мурдагы эски мектеп 1936-жылы салынган болчу.
              </p>
              <p>
                Мектептин мүмкүнчүлүктөрү Мектеп 225 орунга ылайыкташкан,
                 ошону менен бирге спорт залы, ашкана жана жуунучу жайлар бар. 
                Мектеп заманбап талаптар боюнча түзүлгөн — окуучулар үчүн жагымдуу билим берүү шарты каралган.
              </p>
            </div>
            <div className={styles.imageBlock}>
              <img src={Hom} alt="School History" />
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