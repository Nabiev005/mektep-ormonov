import React, { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { Award, BookOpen, Brain, Lock, LogOut, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { auth, db } from '../../firebase';
import { ensureStudentProfile, signInStudentWithGoogle, signOutStudent } from '../../utils/studentAccount';
import styles from './StudentPanel.module.css';

interface StudentProgress {
  totalXP?: number;
  sources?: Record<string, number>;
  courses?: Record<string, {
    title?: string;
    progressPercent?: number;
    completed?: number;
    total?: number;
    score?: number;
    certificateEligible?: boolean;
  }>;
  certificates?: Record<string, {
    title?: string;
    reason?: string;
    status?: string;
  }>;
  lastActivity?: {
    source?: string;
    amount?: number;
    progressPercent?: number;
    score?: number;
    at?: string;
  };
}

const languageStats = [
  { key: 'turkish', title: 'Түрк тили', learnedKey: 'turkish_learned_words', scoreKey: 'turkish_score', icon: '🇹🇷' },
  { key: 'english', title: 'Англис тили', learnedKey: 'english_learned_words', scoreKey: 'english_score', icon: '🇬🇧' },
  { key: 'russian', title: 'Орус тили', learnedKey: 'russian_learned_words', scoreKey: 'russian_score', icon: '🇷🇺' },
];

const getStoredArrayCount = (key: string) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value.length : 0;
  } catch {
    return 0;
  }
};

const StudentPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAvatarFailed(false);
      setLoading(false);
      if (currentUser) {
        await ensureStudentProfile(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setProgress(null);
      return;
    }
    const unsubscribe = onSnapshot(doc(db, 'student_progress', user.uid), (snapshot) => {
      setProgress(snapshot.data() as StudentProgress | null);
    });
    return () => unsubscribe();
  }, [user]);

  const localLanguages = useMemo(() => languageStats.map((item) => {
    const cloudCourse = progress?.courses?.[`${item.key}_language`];
    return {
      ...item,
      learned: cloudCourse?.completed ?? getStoredArrayCount(item.learnedKey),
      score: cloudCourse?.score ?? Number(localStorage.getItem(item.scoreKey) || 0),
      percent: cloudCourse?.progressPercent ?? 0,
      certificateEligible: cloudCourse?.certificateEligible || false,
    };
  }), [progress]);

  const totalLocalWords = localLanguages.reduce((sum, item) => sum + item.learned, 0);
  const cloudCourses = Object.entries(progress?.courses || {});
  const certificateCount = Object.keys(progress?.certificates || {}).length;
  const totalXP = progress?.totalXP || 0;
  const duelXP = progress?.sources?.duel_game || 0;
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Окуучу';
  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    setError('');
    try {
      await signInStudentWithGoogle();
    } catch {
      setError('Google менен кирүү ишке ашкан жок. Firebase Authentication ичинде Google provider күйгүзүлгөнүн текшериңиз.');
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loader}>Окуучу панели жүктөлүүдө...</div>;
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <section className={styles.loginHero}>
          <span className={styles.badge}><ShieldCheck size={18} /> Коопсуз окуучу аккаунту</span>
          <h1>Google аккаунт менен окуучу панели</h1>
          <p>
            Окуучунун прогресси жеке аккаунтка байланат. Маалымат башкаларга көрүнбөйт,
            ар бир окуучу өз панелин гана көрөт.
          </p>
          <button type="button" onClick={handleGoogleLogin} disabled={loginLoading} className={styles.googleBtn}>
            <span>G</span>
            {loginLoading ? 'Кирүүдө...' : 'Google менен кирүү'}
          </button>
          {error && <strong className={styles.errorText}>{error}</strong>}
          <div className={styles.privacyGrid}>
            <div><Lock size={20} /><b>Жеке профиль</b><small>UID боюнча бөлүнүп сакталат.</small></div>
            <div><Award size={20} /><b>Упайлар</b><small>Оюндардагы XP аккаунтка кошулат.</small></div>
            <div><BookOpen size={20} /><b>Сабак прогресси</b><small>Тил курстарынын натыйжасы көрүнөт.</small></div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.profileHero}>
        <div className={styles.avatarBox}>
          {user.photoURL && !avatarFailed ? (
            <img src={user.photoURL} alt="" referrerPolicy="no-referrer" onError={() => setAvatarFailed(true)} />
          ) : (
            <span>{initials || <UserRound size={42} />}</span>
          )}
        </div>
        <div>
          <span className={styles.badge}><ShieldCheck size={18} /> Жеке окуучу панели</span>
          <h1>{userName}</h1>
          <p>{user.email}</p>
        </div>
        <button type="button" onClick={signOutStudent} className={styles.logoutBtn}>
          <LogOut size={18} />
          Чыгуу
        </button>
      </section>

      <section className={styles.statsGrid}>
        <article>
          <Sparkles size={24} />
          <strong>{totalXP}</strong>
          <span>Жалпы XP</span>
        </article>
        <article>
          <Brain size={24} />
          <strong>{duelXP}</strong>
          <span>Ким акылдуу XP</span>
        </article>
        <article>
          <BookOpen size={24} />
          <strong>{totalLocalWords}</strong>
          <span>Үйрөнүлгөн сөз</span>
        </article>
        <article>
          <Award size={24} />
          <strong>{certificateCount}</strong>
          <span>Сертификат статусу</span>
        </article>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.badge}>Тил курстары</span>
            <h2>Жеке прогресс</h2>
          </div>
          <div className={styles.languageList}>
            {localLanguages.map((item) => (
              <div key={item.key}>
                <span>{item.icon}</span>
                <strong>{item.title}</strong>
                <small>{item.learned} сөз · {item.score} тест упай · {item.percent}%</small>
                {item.certificateEligible && <small>Сертификатка даяр</small>}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.badge}>Бардык окуу</span>
            <h2>Курстар боюнча пайыз</h2>
          </div>
          <div className={styles.languageList}>
            {cloudCourses.length > 0 ? cloudCourses.map(([key, course]) => (
              <div key={key}>
                <span>📘</span>
                <strong>{course.title || key}</strong>
                <small>{course.completed || 0}/{course.total || 0} · {course.progressPercent || 0}% · {course.score || 0} упай</small>
              </div>
            )) : (
              <p className={styles.securityText}>Азырынча Firebaseке сакталган курс прогресси жок.</p>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.badge}>Коопсуздук</span>
            <h2>Маалымат кимге көрүнөт?</h2>
          </div>
          <p className={styles.securityText}>
            Окуучунун жеке профили `students/{user.uid}` жана прогресси `student_progress/{user.uid}` документтеринде сакталат.
            Бул структура Firestore rules аркылуу “өзү гана окуй/жаза алат” деп корголууга даяр.
          </p>
          {progress?.lastActivity?.source && (
            <div className={styles.lastActivity}>
              <b>Акыркы активдүүлүк</b>
              <span>{progress.lastActivity.source} · {progress.lastActivity.progressPercent ?? `+${progress.lastActivity.amount || 0} XP`}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentPanel;
