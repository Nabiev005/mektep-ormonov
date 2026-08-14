import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Award, BookOpen, Brain, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { db } from '../../firebase';
import styles from '../StudentPanel/StudentPanel.module.css';

interface StudentProfile {
  displayName?: string;
  photoURL?: string;
  className?: string;
  isPublic?: boolean;
}

interface StudentProgress {
  totalXP?: number;
  sources?: Record<string, number>;
  courses?: Record<string, {
    title?: string;
    progressPercent?: number;
    completed?: number;
    total?: number;
    score?: number;
  }>;
  certificates?: Record<string, {
    title?: string;
    reason?: string;
  }>;
}

const Portfolio: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;

    (async () => {
      try {
        const [profileSnap, progressSnap] = await Promise.all([
          getDoc(doc(db, 'students', uid)),
          getDoc(doc(db, 'student_progress', uid)),
        ]);

        if (cancelled) return;

        const profileData = profileSnap.data() as StudentProfile | undefined;
        if (!profileSnap.exists() || !profileData?.isPublic) {
          setNotFound(true);
        } else {
          setProfile(profileData);
          setProgress((progressSnap.data() as StudentProgress | undefined) || null);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [uid]);

  if (loading) {
    return <div className={styles.loader}>Портфолио жүктөлүүдө...</div>;
  }

  if (notFound || !profile) {
    return (
      <div className={styles.page}>
        <section className={styles.loginHero}>
          <span className={styles.badge}><ShieldCheck size={18} /> Портфолио</span>
          <h1>Бул портфолио табылган жок</h1>
          <p>Же шилтеме туура эмес, же окуучу портфолиосун жабык кылып койгон.</p>
        </section>
      </div>
    );
  }

  const cloudCourses = Object.entries(progress?.courses || {});
  const certificates = Object.values(progress?.certificates || {});
  const totalXP = progress?.totalXP || 0;
  const duelXP = progress?.sources?.duel_game || 0;
  const userName = profile.displayName || 'Окуучу';
  const initials = userName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className={styles.page}>
      <section className={styles.profileHero}>
        <div className={styles.avatarBox}>
          {profile.photoURL && !avatarFailed ? (
            <img src={profile.photoURL} alt="" referrerPolicy="no-referrer" onError={() => setAvatarFailed(true)} />
          ) : (
            <span>{initials || <UserRound size={42} />}</span>
          )}
        </div>
        <div>
          <span className={styles.badge}><ShieldCheck size={18} /> Окуучунун ачык портфолиосу</span>
          <h1>{userName}</h1>
          {profile.className && <p>{profile.className}</p>}
        </div>
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
          <strong>{cloudCourses.length}</strong>
          <span>Курс</span>
        </article>
        <article>
          <Award size={24} />
          <strong>{certificates.length}</strong>
          <span>Сертификат</span>
        </article>
      </section>

      <section className={styles.contentGrid}>
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
              <p className={styles.securityText}>Азырынча курс прогресси жок.</p>
            )}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.badge}>Жетишкендиктер</span>
            <h2>Сертификаттар</h2>
          </div>
          <div className={styles.languageList}>
            {certificates.length > 0 ? certificates.map((cert, index) => (
              <div key={`${cert.title}-${index}`}>
                <span>📜</span>
                <strong>{cert.title}</strong>
                <small>{cert.reason}</small>
              </div>
            )) : (
              <p className={styles.securityText}>Азырынча сертификат жок.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
