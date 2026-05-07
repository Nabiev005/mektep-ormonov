import React from 'react';
import { motion } from 'framer-motion';
import ZayilPhoto from '../../assets/ormonov.png';
import HomePhoto from '../../assets/home1.png';
import styles from './About.module.css';

const values = [
  {
    icon: '🎓',
    title: 'Сапаттуу билим',
    text: 'Окуучулардын негизги билимин бекемдеп, заманбап көндүмдөрдү өнүктүрөбүз.',
  },
  {
    icon: '🤝',
    title: 'Биримдик',
    text: 'Мугалим, окуучу жана ата-эне бир максатта иштеген чөйрө түзөбүз.',
  },
  {
    icon: '🚀',
    title: 'Өнүгүү',
    text: 'IT, чыгармачылык жана практикалык сабактар аркылуу жаңы мүмкүнчүлүк ачабыз.',
  },
];

const facts = [
  { value: '2015-2017', label: 'Жаңы имарат курулган жылдар' },
  { value: '225', label: 'Окуучуга ылайыкташкан' },
  { value: '1936', label: 'Эски имараттын тарыхый башаты' },
];

const About: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.aboutPage}
    >
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Биз жөнүндө</span>
          <h1>Зайил Ормонов атындагы жалпы билим берүү мектеби</h1>
          <p>
            Биздин мектеп билимди, тарбияны жана коомго кызмат кылуу маданиятын
            бириктирген заманбап окуу чөйрөсүн түзөт.
          </p>
        </div>
      </section>

      <section className={styles.facts}>
        {facts.map((fact) => (
          <div className={styles.factCard} key={fact.label}>
            <strong>{fact.value}</strong>
            <span>{fact.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.story}>
        <div className={styles.storyText}>
          <span className={styles.eyebrow}>Тарых</span>
          <h2>Мектептин негизделиши жана бүгүнкү мүмкүнчүлүктөрү</h2>
          <p>
            Зайил Ормонов атындагы орто мектеп заман талабына ылайык жаңы имаратта
            2015-2017-жылдары республикалык бюджеттин эсебинен курулуп, пайдаланууга берилген.
            Жаңы мектеп имараты 1936-жылы курулган эски имараттын ордуна салынган.
          </p>
          <p>
            Имаратта заманбап окуу класстары, спорт залы, ашкана жана окуучулар үчүн
            коопсуз, жагымдуу билим берүү шарттары түзүлгөн. Мектеп окуучулардын билимине
            гана эмес, инсандык сапатына да өзгөчө көңүл бурат.
          </p>
        </div>
        <div className={styles.storyImage}>
          <img src={HomePhoto} alt="Мектеп имараты" />
        </div>
      </section>

      <section className={styles.person}>
        <div className={styles.personImage}>
          <img src={ZayilPhoto} alt="Зайил Ормонов" />
        </div>
        <div className={styles.personText}>
          <span className={styles.eyebrow}>Инсандык мурас</span>
          <h2>Зайил Ормонов</h2>
          <p>
            Зайил Ормонов 1920-жылы төрөлгөн. Ал 1941-1945-жылдардагы Улуу Ата
            Мекендик согуштун катышуучусу болуп, фронттон кайтып келгенден кийин
            өз өмүрүн чарбаны калыбына келтирүүгө жана аймакты өнүктүрүүгө арнаган.
          </p>
          <p>
            Кан айылынын инфраструктурасын жакшыртууда, таза суу киргизүүдө,
            ирригациялык системаларды уюштурууда жана мектеп имараттарын курууда
            анын эмгеги чоң болгон. Мектепке анын ысымы ыйгарылышы — билимге,
            эмгекке жана мекенчилдикке берилген урмат.
          </p>
          <div className={styles.legacyGrid}>
            <div>
              <strong>Максаты</strong>
              <span>Айыл жаштарын сабаттуу жана мекенчил кылып тарбиялоо.</span>
            </div>
            <div>
              <strong>Мурасы</strong>
              <span>Эмгекчилдик, жоопкерчилик жана билимге умтулуу.</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.values}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Баалуулуктар</span>
          <h2>Биз таянган негизги принциптер</h2>
        </div>
        <div className={styles.valuesGrid}>
          {values.map((value) => (
            <motion.div
              key={value.title}
              whileHover={{ y: -6 }}
              className={styles.valueCard}
            >
              <div className={styles.icon}>{value.icon}</div>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};

export default About;
