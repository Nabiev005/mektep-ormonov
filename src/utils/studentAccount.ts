import type { User } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, increment, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInStudentWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  await ensureStudentProfile(result.user);
  return result.user;
};

export const signOutStudent = () => signOut(auth);

export const ensureStudentProfile = async (user: User) => {
  await setDoc(
    doc(db, 'students', user.uid),
    {
      uid: user.uid,
      displayName: user.displayName || 'Окуучу',
      email: user.email || '',
      photoURL: user.photoURL || '',
      provider: 'google',
      role: 'student',
      isPublic: false,
      lastLoginAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/** Firestore эрежелери бир жазууда ушундан көп XP кошууга уруксат бербейт (firestore.rules: validXPChange). */
export const MAX_XP_PER_ACTION = 150;

export const addStudentXP = async (user: User, rawAmount: number, source: string, meta: Record<string, unknown> = {}) => {
  const amount = Math.max(0, Math.min(MAX_XP_PER_ACTION, Math.round(rawAmount)));
  if (amount === 0) return;
  const progressRef = doc(db, 'student_progress', user.uid);
  await setDoc(
    progressRef,
    {
      uid: user.uid,
      displayName: user.displayName || 'Окуучу',
      photoURL: user.photoURL || '',
      totalXP: increment(amount),
      [`sources.${source}`]: increment(amount),
      lastActivity: {
        source,
        amount,
        ...meta,
        at: new Date().toISOString(),
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await setDoc(
    doc(db, 'leaderboard', user.uid),
    {
      uid: user.uid,
      displayName: user.displayName || 'Окуучу',
      photoURL: user.photoURL || '',
      totalXP: increment(amount),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

/** Окуучунун классын сактайт (үй тапшырма жана рейтинг үчүн колдонулат). */
export const setStudentClassName = async (user: User, className: string) => {
  await setDoc(doc(db, 'students', user.uid), { className, updatedAt: serverTimestamp() }, { merge: true });
  await setDoc(
    doc(db, 'leaderboard', user.uid),
    { uid: user.uid, displayName: user.displayName || 'Окуучу', photoURL: user.photoURL || '', className, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

/** Окуучунун портфолиосун (студенттик прогресс баракчасын) ачык/жабык кылат. */
export const setStudentPublic = async (user: User, isPublic: boolean) => {
  await setDoc(doc(db, 'students', user.uid), { isPublic }, { merge: true });
};

interface StudentCourseProgressPayload {
  source: string;
  title: string;
  progressPercent: number;
  completed?: number;
  total?: number;
  score?: number;
  record?: number;
  certificateEligible?: boolean;
  meta?: Record<string, unknown>;
}

export const recordStudentCourseProgress = async (user: User | null | undefined, payload: StudentCourseProgressPayload) => {
  if (!user) return;

  const progressPercent = Math.max(0, Math.min(100, Math.round(payload.progressPercent)));
  const score = payload.score || 0;
  const isLanguageRecord = payload.source.includes('language') && score >= 50;
  const certificateEligible = Boolean(payload.certificateEligible || progressPercent >= 100 || isLanguageRecord);
  const certificateKey = `${payload.source}_${progressPercent >= 100 ? 'completed' : 'record'}`;

  await setDoc(
    doc(db, 'student_progress', user.uid),
    {
      uid: user.uid,
      displayName: user.displayName || 'Окуучу',
      email: user.email || '',
      photoURL: user.photoURL || '',
      [`courses.${payload.source}`]: {
        title: payload.title,
        progressPercent,
        completed: payload.completed || 0,
        total: payload.total || 0,
        score,
        record: Math.max(payload.record || 0, score),
        certificateEligible,
        updatedAt: new Date().toISOString(),
        ...(payload.meta || {}),
      },
      ...(certificateEligible ? {
        [`certificates.${certificateKey}`]: {
          source: payload.source,
          title: payload.title,
          reason: progressPercent >= 100 ? 'Курсту толук аяктаган' : 'Тил курсунда жогорку рекорд жараткан',
          progressPercent,
          score,
          status: 'ready',
          createdAt: new Date().toISOString(),
        },
      } : {}),
      lastActivity: {
        source: payload.source,
        amount: 0,
        progressPercent,
        score,
        at: new Date().toISOString(),
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
