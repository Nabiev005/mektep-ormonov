/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { 
  collection, doc, onSnapshot, setDoc, updateDoc, 
  getDocs, query, where, arrayUnion, orderBy, limit 
} from 'firebase/firestore'; 
import { ArrowLeft, Brain, CheckCircle2, Crown, Loader2, Send, Sparkles, Trophy, UserRound, XCircle } from 'lucide-react';
import styles from './DuelGame.module.css';

const SUBJECTS = [
  { id: 'math', name: 'Математика', icon: '🔢', color: '#3b82f6' },
  { id: 'kyrgyz', name: 'Кыргыз тили', icon: '🇰🇬', color: '#ef4444' },
  { id: 'english', name: 'English', icon: '🇬🇧', color: '#10b981' },
  { id: 'history', name: 'Тарых', icon: '📜', color: '#f59e0b' },
];

const DuelGame: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [currentSubject, setCurrentSubject] = useState<any>(null);
  const [problem, setProblem] = useState({ q: '', a: '' });
  const [userAnswer, setUserAnswer] = useState('');
  const [leaders, setLeaders] = useState<any[]>([]);
  const [dbQuestions, setDbQuestions] = useState<any[]>([]); // Базадан келген суроолор үчүн
  const [starting, setStarting] = useState(false);
  const [nameError, setNameError] = useState('');
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // 1. Лидерлер тактасы (Баардык оюндардагы мыкты оюнчулар)
  useEffect(() => {
    const q = query(collection(db, 'math_arena'), orderBy('createdAt', 'desc'), limit(10));
    const unsub = onSnapshot(q, (snap) => {
      const allPlayers: any[] = [];
      snap.docs.forEach(d => {
        if (d.data().players) allPlayers.push(...d.data().players);
      });
      const sorted = allPlayers
        .sort((a, b) => b.score - a.score)
        .filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)
        .slice(0, 5);
      setLeaders(sorted);
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
    if (!userName.trim()) {
      setNameError("Оюнга кирүү үчүн атыңызды жазыңыз.");
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
      const playerObj = { name: userName.trim(), score: 0, avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${userName}`, subject: subject.id };

      if (snapArena.empty) {
        const newRef = doc(collection(db, 'math_arena'));
        await setDoc(newRef, { id: newRef.id, players: [playerObj], status: 'active', subject: subject.id, createdAt: Date.now() });
        setGameId(newRef.id);
      } else {
        const gameDoc = snapArena.docs[0];
        await updateDoc(doc(db, 'math_arena', gameDoc.id), { players: arrayUnion(playerObj) });
        setGameId(gameDoc.id);
      }
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    if (!gameId) return;
    const unsub = onSnapshot(doc(db, 'math_arena', gameId), (s) => setGameState(s.data()));
    return () => unsub();
  }, [gameId]);

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer || !gameId) return;

    if (userAnswer.toLowerCase().trim() === problem.a) {
      const updatedPlayers = gameState.players.map((p: any) => 
        p.name === userName ? { ...p, score: (p.score || 0) + 10 } : p
      );
      await updateDoc(doc(db, 'math_arena', gameId), { players: updatedPlayers });
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
          <p>Предметти тандап, суроолорго тез жооп бериңиз. Ар бир туура жооп 10 XP алып келет.</p>
          <div className={styles.nameBox}>
            <UserRound size={20} />
            <input
              className={styles.nameInput}
              placeholder="Атыңызды жазыңыз..."
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (nameError) setNameError('');
              }}
            />
          </div>
          {nameError && <span className={styles.nameError}>{nameError}</span>}
        </header>
        <div className={styles.mainLayout}>
          <div className={styles.subjectGrid}>
            {SUBJECTS.map(s => (
              <button key={s.id} className={styles.sCard} onClick={() => startSubject(s)} style={{'--clr': s.color} as any} disabled={starting}>
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
          <button onClick={() => {setGameId(null); setCurrentSubject(null); setAnswerStatus('idle');}} className={styles.backBtn}><ArrowLeft size={18} /> Артка</button>
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
             {gameState?.players?.length ? gameState.players.map((p: any, i: number) => (
               <div key={i} className={`${styles.pScoreRow} ${p.name === userName ? styles.isMe : ''}`}>
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
