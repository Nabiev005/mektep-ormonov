import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpenCheck, Brain, Calculator, Clock3, GraduationCap, Lightbulb, PenLine, Route, Sparkles, Trophy } from 'lucide-react';
import styles from './ORTPrep.module.css';

const subjects = [
  {
    id: 'math',
    title: 'Математика',
    desc: 'Сандарды салыштыруу, логикалык эсептер, пайыз, пропорция жана геометрия боюнча машыгуу.',
    icon: Calculator,
    color: '#2563eb',
    progress: 45,
    type: 'Негизги бөлүм',
  },
  {
    id: 'analogies',
    title: 'Аналогиялар',
    desc: 'Сөздөрдүн ортосундагы логикалык байланышты таап, ой жүгүртүүнү тездетүү.',
    icon: Brain,
    color: '#16a34a',
    progress: 30,
    type: 'Негизги бөлүм',
  },
  {
    id: 'reading',
    title: 'Окуу жана түшүнүү',
    desc: 'Текстти тез окуу, негизги ойду табуу жана суроого далил менен жооп берүү.',
    icon: BookOpenCheck,
    color: '#ea580c',
    progress: 15,
    type: 'Негизги бөлүм',
  },
  {
    id: 'grammar',
    title: 'Кыргыз тили',
    desc: 'Грамматика, пунктуация, лексика жана сүйлөм түзүлүшү боюнча суроолор.',
    icon: PenLine,
    color: '#7c3aed',
    progress: 60,
    type: 'Негизги бөлүм',
  },
  {
    id: 'tips',
    title: 'ЖРТ лайфхактар',
    desc: 'Убакытты үнөмдөө, жооп тандоо жана тест күнү өзүн туура алып жүрүү кеңештери.',
    icon: Lightbulb,
    color: '#ca8a04',
    progress: 100,
    type: 'Кошумча',
  },
  {
    id: 'methodology',
    title: 'ЖРТ методикасы',
    desc: 'Тестти иштөө тактикасы, бөлүмдөрдү бөлүштүрүү жана упай эсептөө принциптери.',
    icon: Route,
    color: '#334155',
    progress: 0,
    type: 'Стратегия',
  },
];

const ORTPrep = () => {
  const navigate = useNavigate();

  const openSubject = (id: string) => {
    if (id === 'tips') navigate('/ort-tips');
    else navigate(`/ort/${id}`);
  };

  return (
    <div className={styles.page}>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.hero}
      >
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>
            <GraduationCap size={18} />
            ORT / ЖРТ даярдык
          </span>
          <h1>ЖРТ даярдык борбору</h1>
          <p>
            Бул бөлүмдө математика, аналогия, окуу жана түшүнүү, кыргыз тили
            жана тест тапшыруу стратегиялары боюнча этап-этабы менен машыгасыз.
          </p>
        </div>

        <div className={styles.heroStats}>
          <div>
            <Trophy size={23} />
            <strong>{subjects.length}</strong>
            <span>даярдык багыты</span>
          </div>
          <div>
            <Clock3 size={23} />
            <strong>Тактика</strong>
            <span>убакытты туура колдонуу</span>
          </div>
        </div>
      </motion.section>

      <section className={styles.wordCard}>
        <span>
          <Sparkles size={18} />
          Күндүн сөзү
        </span>
        <h2>Кайрат</h2>
        <p>Кыйынчылыктарга багынбаган эрктүүлүк, чыдамкайлык жана чечкиндүүлүк.</p>
      </section>

      <section className={styles.explainGrid}>
        <article>
          <Brain size={22} />
          <h3>ЖРТ эмнени текшерет?</h3>
          <p>ЖРТ билимди гана эмес, логика, убакытты башкаруу жана суроону туура түшүнүүнү текшерет.</p>
        </article>
        <article>
          <Route size={22} />
          <h3>Кантип даярданабыз?</h3>
          <p>Бөлүмдү тандаңыз, суроолорду иштеңиз, ката кеткен теманы кайра караңыз жана ылдамдыкты өстүрүңүз.</p>
        </article>
      </section>

      <div className={styles.sectionHeader}>
        <h2>Даярдык бөлүмдөрү</h2>
        <p>Каалаган багытты тандап, машыгууну баштаңыз.</p>
      </div>

      <div className={styles.grid}>
        {subjects.map((subject, index) => {
          const Icon = subject.icon;
          return (
            <motion.button
              key={subject.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={styles.card}
              style={{ '--subject-color': subject.color } as React.CSSProperties}
              onClick={() => openSubject(subject.id)}
              type="button"
            >
              <div className={styles.cardTop}>
                <span className={styles.iconBox}>
                  <Icon size={30} />
                </span>
                <div>
                  <h3>{subject.title}</h3>
                  <small>{subject.type}</small>
                </div>
              </div>

              <p>{subject.desc}</p>

              <div className={styles.progressBlock}>
                <div>
                  <span>Өздөштүрүү</span>
                  <b>{subject.progress}%</b>
                </div>
                <div className={styles.progressTrack}>
                  <span style={{ width: `${subject.progress}%` }} />
                </div>
              </div>

              <strong className={styles.actionText}>
                {subject.id === 'tips' ? 'Кеңештерди окуу' : subject.id === 'methodology' ? 'Методиканы көрүү' : 'Машыгууну баштоо'}
              </strong>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ORTPrep;
