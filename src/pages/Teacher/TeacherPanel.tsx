import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import styles from './TeacherPanel.module.css';

const TeacherPanel: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teacherData, setTeacherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Жаңыртуу үчүн штаттар
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchMyData = async () => {
      const user = auth.currentUser;
      if (user) {
        // Мугалимдин IDси менен "teachers" коллекциясынан маалыматты табабыз
        // Эскертүү: Мугалимдин Firestore'догу IDси анын Auth UIDси менен бирдей болушу керек
        const docRef = doc(db, "teachers", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTeacherData(data);
          setTitle(data.title);
          setDescription(data.description);
        }
      }
      setLoading(false);
    };

    fetchMyData();
  }, []);

  const handleUpdate = async () => {
    if (!auth.currentUser) return;
    try {
      const docRef = doc(db, "teachers", auth.currentUser.uid);
      await updateDoc(docRef, {
        title,
        description,
      });
      alert("Маалыматыңыз ийгиликтүү жаңыртылды! ✨");
      setEditMode(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Жаңыртууда ката кетти.");
    }
  };

  if (loading) return <div>Жүктөлүүдө...</div>;
  if (!teacherData) return <div>Сизге мугалим катары кирүүгө уруксат берилген эмес.</div>;

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
    </div>
  );
};

export default TeacherPanel;