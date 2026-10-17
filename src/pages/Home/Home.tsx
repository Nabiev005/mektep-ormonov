import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  ChevronRight,
  Code2,
  FileText,
  FlaskConical,
  GraduationCap,
  Library,
  Newspaper,
  Phone,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { db } from '../../firebase';
import SchoolPhoto from '../../assets/Home.jpg';
import OrmonovPhoto from '../../assets/ormonov.png';
import styles from './Home.module.css';

interface NewsPreview {
  id: string;
  title: string;
  description?: string;
  date?: string;
  imageUrl?: string;
  imageUrls?: string[];
}

type Tone = 'blue' | 'green' | 'amber' | 'red';

const STATS: { label: string; value: string; note: string; icon: LucideIcon; tone: Tone }[] = [
  { label: 'Окуучулар', value: '250+', note: '1–11-класстар', icon: GraduationCap, tone: 'blue' },
  { label: 'Мугалимдер', value: '20+', note: 'Тажрыйбалуу педагогдор', icon: Users, tone: 'green' },
  { label: 'Ийримдер', value: '20+', note: 'IT, спорт, искусство', icon: Sparkles, tone: 'amber' },
  { label: 'ЖРТ орточо балл', value: '130', note: 'Бүтүрүүчүлөрдүн жыйынтыгы', icon: Trophy, tone: 'red' },
];

const QUICK_LINKS: { label: string; note: string; path: string; icon: LucideIcon }[] = [
  { label: 'Сабак расписаниеси', note: 'Класстар боюнча жума', path: '/schedule', icon: CalendarDays },
  { label: 'Окуучу панели', note: 'XP, сертификат, үй тапшырма', path: '/student-panel', icon: GraduationCap },
  { label: 'ЖРТга даярдык', note: 'Тесттер жана кеңештер', path: '/community/ort', icon: Library },
  { label: 'Мугалимдердин иш пландары', note: 'Сабак пландары', path: '/library', icon: FileText },
  { label: 'Байланыш', note: 'Администрацияга кайрылуу', path: '/contact', icon: Phone },
];

const DIRECTIONS: { title: string; text: string; path: string; icon: LucideIcon }[] = [
  {
    title: 'Интерактивдүү лаборатория',
    text: 'Физика, математика жана геометрия боюнча симуляциялар, графиктер, 3D фигуралар.',
    path: '/community/interactive-lab',
    icon: FlaskConical,
  },
  {
    title: 'IT жана программалоо',
    text: 'HTML, CSS, JavaScript, Python, AI жана оюн түзүү боюнча кадам-кадам курстар.',
    path: '/community/js-game',
    icon: Code2,
  },
  {
    title: 'AI жардамчы',
    text: 'Түшүнбөгөн теманы жаз — AI аны жөнөкөй, орто жана терең деңгээлде түшүндүрөт.',
    path: '/community/ai-tutor',
    icon: Sparkles,
  },
  {
    title: 'Мыкты окуучулар',
    text: 'Олимпиада, спорт жана таланттар боюнча мектептин сыймыктары бир жерде.',
    path: '/best-students',
    icon: Trophy,
  },
];

const formatToday = () =>
  new Date().toLocaleDateString('ky-KG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsPreview[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    getDocs(query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(4)))
      .then((snap) => setNews(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NewsPreview, 'id'>) }))))
      .catch(() => setNews([]))
      .finally(() => setNewsLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Кош келиңиз 👋</h1>
          <p>Зайил Ормонов атындагы жалпы билим берүү мектебинин расмий сайты</p>
        </div>
        <span className={styles.today}><CalendarDays size={16} /> {formatToday()}</span>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Баткен району, Кан айылы</span>
          <h2>Терең билим, татыктуу тарбия, заманбап мүмкүнчүлүк</h2>
          <p>
            Биздин мектеп окуучуларга сапаттуу билим, санариптик көндүм жана коомго пайдалуу
            инсан болуп өсүүгө шарт түзөт. Бул сайтта мектептин жаңылыктары, расписание,
            мугалимдер жана окуучулар үчүн интерактивдүү сабактар топтолгон.
          </p>
          <div className={styles.heroActions}>
            <Link to="/about" className={styles.primaryButton}>Мектеп жөнүндө <ArrowRight size={17} /></Link>
            <Link to="/student-panel" className={styles.secondaryButton}>Окуучу панели</Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src={SchoolPhoto} alt="Зайил Ормонов атындагы мектептин имараты" />
        </div>
      </section>

      <section className={styles.stats} aria-label="Мектеп көрсөткүчтөрү">
        {STATS.map(({ label, value, note, icon: Icon, tone }) => (
          <div key={label} className={styles.statCard}>
            <div className={styles.statTop}>
              <span className={styles.statLabel}>{label}</span>
              <span className={`${styles.statIcon} ${styles[tone]}`}><Icon size={19} /></span>
            </div>
            <strong className={styles.statValue}>{value}</strong>
            <span className={styles.statNote}>{note}</span>
          </div>
        ))}
      </section>

      <div className={styles.twoColumns}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Акыркы жаңылыктар</h3>
              <p>Мектеп турмушундагы окуялар</p>
            </div>
            <Link to="/news" className={styles.textLink}>Баары <ChevronRight size={16} /></Link>
          </div>
          <div className={styles.cardBody}>
            {newsLoading ? (
              <div className={styles.skeletonList}>
                {[0, 1, 2].map((i) => <div key={i} className={styles.skeleton} />)}
              </div>
            ) : news.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}><Newspaper size={24} /></span>
                <strong>Азырынча жаңылык жок</strong>
                <span>Жаңы окуялар бул жерде пайда болот.</span>
              </div>
            ) : (
              <ul className={styles.newsList}>
                {news.map((item) => {
                  const image = item.imageUrls?.[0] || item.imageUrl;
                  return (
                    <li key={item.id}>
                      <Link to="/news" className={styles.newsItem}>
                        {image ? <img src={image} alt="" loading="lazy" /> : <span className={styles.newsPlaceholder}><Newspaper size={20} /></span>}
                        <span className={styles.newsText}>
                          <strong>{item.title}</strong>
                          {item.description && <span>{item.description}</span>}
                        </span>
                        {item.date && <time className={styles.newsDate}>{item.date}</time>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Тез кирүү</h3>
              <p>Көп колдонулган бөлүмдөр</p>
            </div>
          </div>
          <ul className={styles.quickList}>
            {QUICK_LINKS.map(({ label, note, path, icon: Icon }) => (
              <li key={path}>
                <Link to={path} className={styles.quickItem}>
                  <span className={styles.quickIcon}><Icon size={18} /></span>
                  <span className={styles.quickText}>
                    <strong>{label}</strong>
                    <span>{note}</span>
                  </span>
                  <ChevronRight size={17} className={styles.quickArrow} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <div className={styles.sectionHeader}>
          <h3>Окуучулар үчүн мүмкүнчүлүктөр</h3>
          <p>Сабактан тышкары өнүгүү үчүн санарип куралдар</p>
        </div>
        <div className={styles.directions}>
          {DIRECTIONS.map(({ title, text, path, icon: Icon }) => (
            <Link key={path} to={path} className={styles.directionCard}>
              <span className={styles.directionIcon}><Icon size={20} /></span>
              <strong>{title}</strong>
              <span>{text}</span>
              <span className={styles.directionMore}>Кирүү <ArrowRight size={15} /></span>
            </Link>
          ))}
        </div>
      </section>

      <div className={styles.twoColumns}>
        <section className={`${styles.card} ${styles.namesake}`}>
          <img src={OrmonovPhoto} alt="Зайил Ормонов" />
          <div>
            <span className={styles.eyebrow}>Мектептин аты</span>
            <h3>Зайил Ормонов</h3>
            <p>Мектебибиз Зайил Ормоновдун атын алып жүрөт. Анын билим жолундагы үлгүсү окуучуларыбызга шыктануу берет.</p>
            <Link to="/about" className={styles.textLink}>Толугураак <ChevronRight size={16} /></Link>
          </div>
        </section>

        <section className={`${styles.card} ${styles.contactCard}`}>
          <span className={styles.quickIcon}><BookOpenCheck size={20} /></span>
          <h3>Сурооңуз барбы?</h3>
          <p>Кабыл алуу, сабактар же мектеп турмушу боюнча администрацияга кайрылыңыз.</p>
          <Link to="/contact" className={styles.primaryButton}>Байланышуу <ArrowRight size={17} /></Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
