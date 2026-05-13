import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, MessageCircle, Send } from 'lucide-react';
import ZayilPhoto from '../../assets/ormonov.png';
import HomePhoto from '../../assets/home1.png';
import AuthorPhoto from '../../assets/author-aybek.jpg';
import AuthorWorkOne from '../../assets/author-work-1.jpeg';
import AuthorWorkTwo from '../../assets/author-work-2.jpeg';
import AuthorSchoolPhoto from '../../assets/author-school-photo.jpg';
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

const portalFeatures = [
  { icon: '📰', title: 'Жаңылыктар', text: 'Мектептеги иш-чаралар, жетишкендиктер жана маанилүү маалыматтар.' },
  { icon: '📅', title: 'Расписание', text: 'Класстар боюнча сабактардын күнүмдүк тартибин тез көрүү.' },
  { icon: '📄', title: 'Иш пландар', text: 'Мугалимдердин иш пландары жана окуу материалдары сүрөт түрүндө жарыяланат.' },
  { icon: '🧑‍💻', title: 'IT билим', text: 'Frontend, Python жана AI үйрөнүү үчүн интерактивдүү бөлүмдөр.' },
];

const authorNotes = [
  '2005-жылы 23-июнда төрөлгөн.',
  'Зайил Ормонов атындагы мектептин 11-классын бүтүргөн.',
  'Азыркы тапта Fullstack программист катары иш алып барат.',
];

const authorJourney = [
  {
    year: '7-класс',
    title: 'ITге кызыгуу башталган',
    text: 'Айбек программалоого мектеп кезинен кызыгып, өз алдынча издене баштаган.',
  },
  {
    year: 'Бишкек',
    title: 'Окурмен жеке IT академиясы',
    text: 'Бишкек шаарында Окурмен жеке IT академиясында окуп, эң мыкты даражада аяктаган.',
  },
  {
    year: '2.5 ай',
    title: 'Kaitech IT компаниясы',
    text: 'Окууну бүткөндөн кийин Kaitech IT компаниясында практикалык тажрыйба топтогон.',
  },
  {
    year: '6 ай',
    title: 'Techperson IT окуу борбору',
    text: 'Techperson IT окуу борборунда сабак берип, окуучулар менен иштеген.',
  },
  {
    year: '9 ай',
    title: 'Окурмен Kids окуу борбору',
    text: 'CRM системасында регистратор болуп иштеп, окуу борбордун иш процессине катышкан.',
  },
];

const authorGallery = [
  { src: AuthorWorkOne, title: 'Технопарктагы иш күнү' },
  { src: AuthorWorkTwo, title: 'Fullstack иш процесси' },
];

const authorContacts = [
  {
    label: 'Instagram',
    value: '@aibek__dev',
    href: 'https://www.instagram.com/aibek__dev',
    icon: Instagram,
  },
  {
    label: 'Telegram',
    value: '+996 702 952 200',
    href: 'tg://resolve?phone=996702952200',
    icon: Send,
  },
  {
    label: 'WhatsApp',
    value: '+996 702 952 200',
    href: 'https://wa.me/996702952200',
    icon: MessageCircle,
  },
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

      <section className={styles.portal}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Санарип портал</span>
          <h2>Сайт эмнелерди бириктирет?</h2>
        </div>
        <div className={styles.portalGrid}>
          {portalFeatures.map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -5 }}
              className={styles.portalCard}
            >
              <div className={styles.icon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.authorSection}>
        <div className={styles.authorCard}>
          <div className={styles.authorPhotoWrap}>
            <figure className={styles.authorMainPhoto}>
              <img src={AuthorPhoto} alt="Набиев Айбек Сапарбаевич" />
              <figcaption>Набиев Айбек</figcaption>
            </figure>
            <div className={styles.authorMiniGallery}>
              {authorGallery.map((image) => (
                <figure key={image.title}>
                  <img src={image.src} alt={image.title} />
                  <figcaption>{image.title}</figcaption>
                </figure>
              ))}
            </div>
            <figure className={styles.authorSidePhoto}>
              <img src={AuthorSchoolPhoto} alt="Айбек мектепте" />
              <figcaption>
                <strong>Азыркы учуру</strong>
                <span>Билим алган жерден башталган IT жол</span>
              </figcaption>
            </figure>
          </div>
          <div className={styles.authorContent}>
            <span className={styles.eyebrow}>Сайт автору</span>
            <h2>Набиев Айбек Сапарбаевич</h2>
            <p>
              Айбек 2005-жылы 23-июнда төрөлгөн. Азыркы учурда Бишкек шаарындагы Технопаркта жайгашкан
              ainabi.studio IT студиясынын жетекчиси жана негиздөөчүсү.
              Ал Зайил Ормонов атындагы мектептин бүтүрүүчүсү катары мектептин
              маалыматтарын заманбап, түшүнүктүү жана колдонууга жеңил форматта
              көрсөтүү үчүн бул сайтты иштеп чыкты.
            </p>
            <div className={styles.authorBuildNote}>
              <strong>Сайт кантип жасалды?</strong>
              <span>
                Бул сайтты жасоого жалпы 1 жыл убакыт кетти. Себеби дизайн,
                интерфейс, логика, админ панель, маалыматтарды базага сактоо,
                сүрөттөрдү жүктөө, иш пландар, мугалимдер, окуучулар, оюндар жана
                IT сабактарынын баары автор тарабынан жазылды. Алгачкы 3 ай иштелгенден
                кийин сайт бузулуп калып, кайра башынан жасала баштаган. Ошондон кийин
                ар бир бөлүм кайра текшерилип, жакшыртылып, бир бүтүн мектеп порталына
                айландырылды.
              </span>
            </div>
            <div className={styles.authorNotes}>
              {authorNotes.map((note, index) => (
                <div key={note}>
                  <strong>0{index + 1}</strong>
                  <span>{note}</span>
                </div>
              ))}
            </div>
            <div className={styles.authorTags}>
              <span>ainabi.studio</span>
              <span>IT студия жетекчиси</span>
              <span>Fullstack программист</span>
              <span>Бишкек, Технопарк</span>
            </div>
            <section className={styles.authorTimelineBlock}>
              <div className={styles.authorTimelineHead}>
                <span className={styles.eyebrow}>Өсүү жолу</span>
                <h3>IT тармагындагы тажрыйба</h3>
              </div>
              <div className={styles.authorTimeline}>
                {authorJourney.map((item) => (
                  <div key={`${item.year}-${item.title}`}>
                    <strong>{item.year}</strong>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className={styles.authorContacts}>
              <div>
                <span className={styles.eyebrow}>Байланыш</span>
                <h3>Автордун социалдык тармактары</h3>
              </div>
              <div className={styles.authorContactGrid}>
                {authorContacts.map((contact) => {
                  const Icon = contact.icon;

                  return (
                    <a
                      key={contact.label}
                      href={contact.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.authorContactCard}
                    >
                      <span className={styles.authorContactIcon}>
                        <Icon size={22} />
                      </span>
                      <span>
                        <strong>{contact.label}</strong>
                        <small>{contact.value}</small>
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;
