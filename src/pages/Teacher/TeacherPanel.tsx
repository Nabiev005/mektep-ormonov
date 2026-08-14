import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { addDoc, collection, doc, getDoc, onSnapshot, query, updateDoc, where, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { motion } from 'framer-motion';
import { classList } from '../../data/classList';
import styles from './TeacherPanel.module.css';

interface Homework {
  id: string;
  className: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt?: { seconds: number };
}

interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentUid: string;
  studentName: string;
  answerText: string;
  submittedAt?: { seconds: number };
}

const TeacherPanel: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teacherData, setTeacherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Жаңыртуу үчүн штаттар
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // ҮЙ ТАПШЫРМА ҮЧҮН ШТАТТАР
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [hwClassName, setHwClassName] = useState(classList[0]);
  const [hwSubject, setHwSubject] = useState('');
  const [hwTitle, setHwTitle] = useState('');
  const [hwDescription, setHwDescription] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');
  const [hwSaving, setHwSaving] = useState(false);
  const [openHomeworkId, setOpenHomeworkId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setTeacherData(null);

      if (currentUser) {
        // Мугалимдин IDси менен "teachers" коллекциясынан маалыматты табабыз
        // Эскертүү: Мугалимдин Firestore'догу IDси анын Auth UIDси менен бирдей болушу керек
        const docRef = doc(db, "teachers", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTeacherData(data);
          setTitle(data.title);
          setDescription(data.description);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setHomeworkList([]);
      return;
    }
    const q = query(collection(db, 'homework'), where('teacherId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Homework[];
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setHomeworkList(data);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!openHomeworkId) {
      setSubmissions([]);
      return;
    }
    const q = query(collection(db, 'homework_submissions'), where('homeworkId', '==', openHomeworkId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as HomeworkSubmission[];
      data.sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0));
      setSubmissions(data);
    });
    return () => unsubscribe();
  }, [openHomeworkId]);

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !hwSubject.trim() || !hwTitle.trim()) return;
    setHwSaving(true);
    try {
      await addDoc(collection(db, 'homework'), {
        teacherId: user.uid,
        teacherName: title || teacherData?.title || 'Мугалим',
        className: hwClassName,
        subject: hwSubject.trim(),
        title: hwTitle.trim(),
        description: hwDescription.trim(),
        dueDate: hwDueDate,
        createdAt: serverTimestamp(),
      });
      setHwSubject('');
      setHwTitle('');
      setHwDescription('');
      setHwDueDate('');
      alert('Үй тапшырма берилди! ✨');
    } catch {
      alert('Тапшырма берүүдө ката кетти.');
    } finally {
      setHwSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "teachers", user.uid);
      await updateDoc(docRef, {
        title,
        description,
      });
      alert("Маалыматыңыз ийгиликтүү жаңыртылды! ✨");
      setEditMode(false);
    } catch {
      alert("Жаңыртууда ката кетти.");
    }
  };

  if (loading) return <div>Жүктөлүүдө...</div>;
  if (!user || !teacherData) return <div>Сизге мугалим катары кирүүгө уруксат берилген эмес.</div>;

  return (
    <div className={styles.container}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.profileCard}>
        <h2>Мугалимдин жеке кабинети</h2>
        <div className={styles.imageSection}>
          <img src={teacherData.imageUrl} alt={teacherData.title} />
        </div>

        {editMode ? (
          <div className={styles.editForm}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Аты-жөнүңүз" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
            <button onClick={handleUpdate} className={styles.saveBtn}>Сактоо</button>
            <button onClick={() => setEditMode(false)} className={styles.cancelBtn}>Жокко чыгаруу</button>
          </div>
        ) : (
          <div className={styles.infoSection}>
            <h3>{title}</h3>
            <p>{description}</p>
            <button onClick={() => setEditMode(true)} className={styles.editBtn}>Маалыматты өзгөртүү ✏️</button>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={styles.homeworkSection}>
        <h2>📚 Үй тапшырма берүү</h2>
        <form onSubmit={handleCreateHomework} className={styles.homeworkForm}>
          <select value={hwClassName} onChange={(e) => setHwClassName(e.target.value)}>
            {classList.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
          </select>
          <input value={hwSubject} onChange={(e) => setHwSubject(e.target.value)} placeholder="Предмет (мис: Математика)" required />
          <input value={hwTitle} onChange={(e) => setHwTitle(e.target.value)} placeholder="Тапшырманын аталышы" required />
          <textarea value={hwDescription} onChange={(e) => setHwDescription(e.target.value)} placeholder="Тапшырманын сүрөттөмөсү" rows={3} />
          <input type="date" value={hwDueDate} onChange={(e) => setHwDueDate(e.target.value)} />
          <button type="submit" className={styles.saveBtn} disabled={hwSaving}>{hwSaving ? 'Берилүүдө...' : 'Тапшырма берүү'}</button>
        </form>

        <div className={styles.homeworkList}>
          <h3>Берилген тапшырмалар ({homeworkList.length})</h3>
          {homeworkList.length === 0 && <p>Азырынча тапшырма берилген жок.</p>}
          {homeworkList.map((hw) => (
            <div key={hw.id} className={styles.homeworkCard}>
              <div className={styles.homeworkCardHead} onClick={() => setOpenHomeworkId(openHomeworkId === hw.id ? null : hw.id)}>
                <div>
                  <b>{hw.title}</b>
                  <span>{hw.className} · {hw.subject}{hw.dueDate ? ` · Мөөнөтү: ${hw.dueDate}` : ''}</span>
                </div>
                <span>{openHomeworkId === hw.id ? '▲' : '▼'}</span>
              </div>
              {openHomeworkId === hw.id && (
                <div className={styles.submissionList}>
                  <p>{hw.description}</p>
                  <b>Тапшырган окуучулар ({submissions.length}):</b>
                  {submissions.length === 0 && <p>Азырынча эч ким тапшырган жок.</p>}
                  {submissions.map((sub) => (
                    <div key={sub.id} className={styles.submissionItem}>
                      <b>{sub.studentName}</b>
                      <p>{sub.answerText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherPanel;