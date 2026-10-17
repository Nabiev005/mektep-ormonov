/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../../firebase';
import {
  collection, doc, onSnapshot, setDoc, updateDoc, getDoc,
  getDocs, query, where, orderBy, limit, increment, serverTimestamp
} from 'firebase/firestore';
import { ArrowLeft, Brain, CheckCircle2, Crown, Loader2, Lock, Send, Sparkles, Trophy, XCircle } from 'lucide-react';
import { addStudentXP, ensureStudentProfile, signInStudentWithGoogle } from '../../../utils/studentAccount';
import styles from './DuelGame.module.css';

const SUBJECTS = [
  { id: 'math', name: 'Математика', icon: '🔢', color: '#3b82f6' },
  { id: 'kyrgyz', name: 'Кыргыз тили', icon: '🇰🇬', color: '#ef4444' },
  { id: 'english', name: 'English', icon: '🇬🇧', color: '#10b981' },
  { id: 'history', name: 'Тарых', icon: '📜', color: '#f59e0b' },
];

const DuelGame: React.FC = () => {
  const [student, setStudent] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [currentSubject, setCurrentSubject] = useState<any>(null);
  const [problem, setProblem] = useState({ q: '', a: '' });
  const [userAnswer, setUserAnswer] = useState('');
  const [leaders, setLeaders] = useState<any[]>([]);
  const [dbQuestions, setDbQuestions] = useState<any[]>([]); // Базадан келген суроолор үчүн
  const [starting, setStarting] = useState(false);
  const [nameError, setNameError] = useState('');
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [avatarFailed, setAvatarFailed] = useState(false);
  const userName = student?.displayName || student?.email?.split('@')[0] || 'Окуучу';
  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setStudent(currentUser);
      setAvatarFailed(false);
      setAuthLoading(false);
      if (currentUser) await ensureStudentProfile(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    setNameError('');
    try {
      await signInStudentWithGoogle();
    } catch {
      setNameError('Google менен кирүү ишке ашкан жок. Firebase Authentication ичинде Google provider күйгүзүлгөнүн текшериңиз.');
    } finally {
      setLoginLoading(false);
    }
  };

  // 1. Лидерлер тактасы (Баардык оюндардагы мыкты оюнчулар)
  useEffect(() => {
    const q = query(collection(db, 'leaderboard'), orderBy('totalXP', 'desc'), limit(5));
    const unsub = onSnapshot(q, (snap) => {
      setLeaders(snap.docs.map((d) => ({ name: d.data().displayName || 'Окуучу', score: d.data().totalXP || 0 })));
    });
    return () => unsub();
  }, []);

  // 2. Жаңы суроо тандоо же жаратуу (Математика үчүн автоматтык, калганы базадан)
  const generateProblem = (source?: any[]) => {
    const qs = source || dbQuestions;

    if (currentSubject?.id === 'math') {
      const n1 = Math.floor(Math.random() * 40) + 1;
      const n2 = Math.floor(Math.random() * 30) + 1;
      const ops = ['+', '-'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let ans = op === '+' ? n1 + n2 : n1 - n2;
      setProblem({ q: `${n1} ${op} ${n2} = ?`, a: ans.toString() });
    } else if (qs.length > 0) {
      const randomQ = qs[Math.floor(Math.random() * qs.length)];
      // ТЕКШЕРҮҮ: Сиздин базадагы талаа аттары 'question' жана 'answer' болушу керек
      setProblem({ 
        q: randomQ.question || "Суроо тексти жок", 
        a: (randomQ.answer || "").toString().toLowerCase().trim() 
      });
    } else {
      setProblem({ q: "Суроолор жүктөлүүдө же база бош...", a: "---" });
    }
  };

  const startSubject = async (subject: any) => {
    if (!student) {
      setNameError("Оюнга кирүү үчүн Google аккаунт менен кириңиз.");
      return;
    }
    setNameError('');
    setStarting(true);
    setCurrentSubject(subject);

    try {
      let loadedQuestions: any[] = [];
      
      // Эгер предмет математика болбосо, 'duel-questions' коллекциясынан суроолорду тартабыз
      if (subject.id !== 'math') {
        const q = query(collection(db, 'duel-questions'), where('subject', '==', subject.id));
        const snap = await getDocs(q);
        loadedQuestions = snap.docs.map(d => d.data());
        setDbQuestions(loadedQuestions);
      }

      // Биринчи суроону дароо көрсөтүү
      if (subject.id === 'math') {
        const n1 = Math.floor(Math.random() * 20) + 5;
        const n2 = Math.floor(Math.random() * 20) + 5;
        setProblem({ q: `${n1} + ${n2} = ?`, a: (n1 + n2).toString() });
      } else {
        if (loadedQuestions.length > 0) {
          const firstQ = loadedQuestions[Math.floor(Math.random() * loadedQuestions.length)];
          setProblem({ q: firstQ.question, a: firstQ.answer.toString().toLowerCase().trim() });
        } else {
          setProblem({ q: "Бул бөлүмгө суроо кошула элек", a: "---" });
        }
      }

      // Аренага (Duel Mode) кошулуу же түзүү
      const qArena = query(collection(db, 'math_arena'), where('status', '==', 'active'), where('subject', '==', subject.id));
      const snapArena = await getDocs(qArena);
      let arenaId: string;
      if (snapArena.empty) {
        const newRef = doc(collection(db, 'math_arena'));
        await setDoc(newRef, { id: newRef.id, status: 'active', subject: subject.id, createdAt: Date.now() });
        arenaId = newRef.id;
      } else {
        arenaId = snapArena.docs[0].id;
      }

      // Оюнчу өз документин гана түзөт; кайра кирсе мурунку упайы сакталат.
      const playerRef = doc(db, 'math_arena', arenaId, 'players', student.uid);
      if (!(await getDoc(playerRef)).exists()) {
        await setDoc(playerRef, {
          uid: student.uid,
          name: userName,
          avatar: student.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.uid}`,
          score: 0,
          updatedAt: serverTimestamp(),
        });
      }
      setGameId(arenaId);
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    if (!gameId) return;
    const q = query(collection(db, 'math_arena', gameId, 'players'), orderBy('score', 'desc'), limit(20));
    const unsub = onSnapshot(q, (snap) => setPlayers(snap.docs.map((d) => d.data())));
    return () => unsub();
  }, [gameId]);

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer || !gameId || !student) return;

    if (userAnswer.toLowerCase().trim() === problem.a) {
      try {
        await updateDoc(doc(db, 'math_arena', gameId, 'players', student.uid), {
          score: increment(10),
          updatedAt: serverTimestamp(),
        });
        await addStudentXP(student, 10, 'duel_game', { subject: currentSubject?.id || 'unknown' });
      } catch {
        // Өтө тез жооп берсе Firestore эрежеси жазууну четке кагат — оюн улана берет.
      }
      setAnswerStatus('correct');
      setUserAnswer('');
      setTimeout(() => {
        setAnswerStatus('idle');
        generateProblem();
      }, 520);
    } else {
      setAnswerStatus('wrong');
      setUserAnswer(''); 
      setTimeout(() => setAnswerStatus('idle'), 700);
    }
  };

  if (!currentSubject) {
    return (
      <div className={styles.dashboard}>
        <header className={styles.dashHeader}>
          <span className={styles.heroBadge}><Brain size={18} /> Интеллект аренасы</span>
          <h1>Ким акылдуу?</h1>
          <p>Предметти тандап, суроолорго тез жооп бериңиз. Ар бир туура жооп жеке Google аккаунтуңузга 10 XP болуп сакталат.</p>
          {authLoading ? (
            <div className={styles.nameBox}><Loader2 size={20} /> Аккаунт текшерилүүдө...</div>
          ) : student ? (
            <div className={styles.studentBox}>
              {student.photoURL && !avatarFailed ? (
                <img src={student.photoURL} alt="" referrerPolicy="no-referrer" onError={() => setAvatarFailed(true)} />
              ) : (
                <span className={styles.avatarFallback}>{initials || <Lock size={20} />}</span>
              )}
              <div>
                <strong>{userName}</strong>
                <span>{student.email}</span>
              </div>
            </div>
          ) : (
            <button type="button" className={styles.googleLoginBtn} onClick={handleGoogleLogin} disabled={loginLoading}>
              <span>G</span>
              {loginLoading ? 'Кирүүдө...' : 'Google менен кирүү'}
            </button>
          )}
          {nameError && <span className={styles.nameError}>{nameError}</span>}
        </header>
        <div className={styles.mainLayout}>
          <div className={styles.subjectGrid}>
            {SUBJECTS.map(s => (
              <button key={s.id} className={styles.sCard} onClick={() => startSubject(s)} style={{'--clr': s.color} as any} disabled={starting || !student}>
                <span className={styles.sIcon}>{s.icon}</span>
                <h3>{s.name}</h3>
                <p>{s.id === 'math' ? 'Ыкчам эсептер' : 'Базадагы суроолор'}</p>
                <div className={styles.sBtn}>{starting && currentSubject?.id === s.id ? <Loader2 size={17} /> : 'Ойноо'}</div>
              </button>
            ))}
          </div>
          <aside className={styles.leaderSection}>
            <h3><Trophy size={20} /> Лидерлер</h3>
            {leaders.length > 0 ? leaders.map((l, i) => (
              <div key={i} className={styles.lRow}>
                <span className={styles.rank}>{i === 0 ? <Crown size={16} /> : i + 1}</span>
                <span>{l.name}</span>
                <b>{l.score} XP</b>
              </div>
            )) : (
              <p className={styles.emptyLeaders}>Азырынча лидер жок. Биринчи болуп ойноңуз.</p>
            )}
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.arena}>
       <div className={styles.arenaHeader}>
          <button onClick={() => {setGameId(null); setPlayers([]); setCurrentSubject(null); setAnswerStatus('idle');}} className={styles.backBtn}><ArrowLeft size={18} /> Артка</button>
          <div>
            <span className={styles.arenaKicker}>Онлайн дуэль</span>
            <h2>{currentSubject.name} аренасы</h2>
          </div>
          <div className={styles.subjectBadge} style={{background: currentSubject.color}}>{currentSubject.icon}</div>
       </div>

       <div className={styles.battleField}>
          <div className={styles.quizZone}>
             <div className={styles.qCard}>
                <span className={styles.questionBadge}><Sparkles size={18} /> Суроо</span>
                <div className={styles.qText}>{problem.q}</div>
                {answerStatus !== 'idle' && (
                  <div className={answerStatus === 'correct' ? styles.correctMsg : styles.wrongMsg}>
                    {answerStatus === 'correct' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    {answerStatus === 'correct' ? 'Туура! +10 XP' : 'Ката. Дагы аракет кылыңыз.'}
                  </div>
                )}
                <form onSubmit={handleAnswer} className={styles.ansForm}>
                  <input autoFocus type="text" className={styles.mathInput} value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Жооп..." />
                  <button type="submit" className={styles.submitBtn}><Send size={18} /> Жөнөтүү</button>
                </form>
             </div>
          </div>

          <div className={styles.liveScore}>
             <h4><Trophy size={18} /> Учурдагы упайлар</h4>
             {players.length ? players.map((p: any) => (
               <div key={p.uid} className={`${styles.pScoreRow} ${p.uid === student?.uid ? styles.isMe : ''}`}>
                  <div className={styles.pInfo}>
                    <span>{p.name}</span>
                    <b>{p.score}</b>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{width: `${Math.min(p.score, 100)}%`, background: currentSubject.color}}></div>
                  </div>
               </div>
             )) : <p className={styles.emptyLeaders}>Оюнчулар жүктөлүүдө...</p>}
          </div>
       </div>
    </div>
  );
};

export default DuelGame;
