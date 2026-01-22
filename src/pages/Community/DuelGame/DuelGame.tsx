/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { 
  collection, doc, onSnapshot, setDoc, updateDoc, 
  getDocs, query, where, arrayUnion, orderBy, limit 
} from 'firebase/firestore'; 
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
    if (!userName.trim()) return alert("Атыңызды жазыңыз!");
    setCurrentSubject(subject);

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
      // eslint-disable-next-line react-hooks/purity
      const n1 = Math.floor(Math.random() * 20) + 5;
      // eslint-disable-next-line react-hooks/purity
      const n2 = Math.floor(Math.random() * 20) + 5;
      setProblem({ q: `${n1} + ${n2} = ?`, a: (n1 + n2).toString() });
    } else {
      if (loadedQuestions.length > 0) {
        // eslint-disable-next-line react-hooks/purity
        const firstQ = loadedQuestions[Math.floor(Math.random() * loadedQuestions.length)];
        setProblem({ q: firstQ.question, a: firstQ.answer.toString().toLowerCase().trim() });
      } else {
        setProblem({ q: "Бул бөлүмгө суроо кошула элек", a: "---" });
      }
    }

    // Аренага (Duel Mode) кошулуу же түзүү
    const qArena = query(collection(db, 'math_arena'), where('status', '==', 'active'), where('subject', '==', subject.id));
    const snapArena = await getDocs(qArena);
    const playerObj = { name: userName, score: 0, avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${userName}`, subject: subject.id };

    if (snapArena.empty) {
      const newRef = doc(collection(db, 'math_arena'));
      // eslint-disable-next-line react-hooks/purity
      await setDoc(newRef, { id: newRef.id, players: [playerObj], status: 'active', subject: subject.id, createdAt: Date.now() });
      setGameId(newRef.id);
    } else {
      const gameDoc = snapArena.docs[0];
      await updateDoc(doc(db, 'math_arena', gameDoc.id), { players: arrayUnion(playerObj) });
      setGameId(gameDoc.id);
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
      setUserAnswer('');
      generateProblem();
    } else {
      setUserAnswer(''); 
      // Жөн гана ката болсо тазалап коёбуз же каалаган эффектти берсе болот
    }
  };

  if (!currentSubject) {
    return (
      <div className={styles.dashboard}>
        <header className={styles.dashHeader}>
          <h1>Салам, {userName || 'Окуучу'}! 👋</h1>
          <input className={styles.nameInput} placeholder="Атыңызды жазыңыз..." value={userName} onChange={(e) => setUserName(e.target.value)} />
        </header>
        <div className={styles.mainLayout}>
          <div className={styles.subjectGrid}>
            {SUBJECTS.map(s => (
              <div key={s.id} className={styles.sCard} onClick={() => startSubject(s)} style={{'--clr': s.color} as any}>
                <span className={styles.sIcon}>{s.icon}</span>
                <h3>{s.name}</h3>
                <div className={styles.sBtn}>Ойноо</div>
              </div>
            ))}
          </div>
          <aside className={styles.leaderSection}>
            <h3>ЛИДЕРЛЕР 🏆</h3>
            {leaders.map((l, i) => (
              <div key={i} className={styles.lRow}>
                <span>{i+1}. {l.name}</span>
                <b>{l.score} XP</b>
              </div>
            ))}
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.arena}>
       <div className={styles.arenaHeader}>
          <button onClick={() => {setGameId(null); setCurrentSubject(null);}} className={styles.backBtn}>← Артка</button>
          <h2>{currentSubject.name} Аренасы</h2>
          <div className={styles.subjectBadge} style={{background: currentSubject.color}}>{currentSubject.icon}</div>
       </div>

       <div className={styles.battleField}>
          <div className={styles.quizZone}>
             <div className={styles.qCard}>
                <div className={styles.qText}>{problem.q}</div>
                <form onSubmit={handleAnswer} className={styles.ansForm}>
                  <input autoFocus type="text" className={styles.mathInput} value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder="Жооп..." />
                  <button type="submit" className={styles.submitBtn}>ЖӨНӨТҮҮ ✅</button>
                </form>
             </div>
          </div>

          <div className={styles.liveScore}>
             <h4>Учурдагы упайлар:</h4>
             {gameState?.players.map((p: any, i: number) => (
               <div key={i} className={`${styles.pScoreRow} ${p.name === userName ? styles.isMe : ''}`}>
                  <div className={styles.pInfo}>
                    <span>{p.name}</span>
                    <b>{p.score}</b>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{width: `${Math.min(p.score, 100)}%`, background: currentSubject.color}}></div>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default DuelGame;