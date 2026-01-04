import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Admin.module.css';

interface ListItem {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  className?: string;
  day?: string;
  lessons?: string;
  date?: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('news');
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Алдын ала көрүү үчүн
  
  const [className, setClassName] = useState('1-класс');
  const [day, setDay] = useState('Дүйшөмбү');
  const [lessons, setLessons] = useState('');

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ListItem[]>([]);

  const IMGBB_API_KEY = '9aed8b9d3a6c54c6a68db494ac681c35';

  const classList = [
    "1-класс", "2-класс", "3-класс", "4-класс", "5-класс", 
    "6-класс", "7-класс", "8-класс", "9-класс", "10-класс", "11-класс"
  ];

  // Сүрөт тандалганда превью түзүү
  useEffect(() => {
    if (!imageFile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    const q = query(collection(db, activeTab));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ListItem[];
      setItems(data);
    }, (error) => {
      console.error("Firebase катасы:", error);
    });
    return () => unsubscribe();
  }, [activeTab]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'schedule') {
        await addDoc(collection(db, "schedule"), {
          className, day, lessons,
          createdAt: serverTimestamp()
        });
        setLessons('');
      } else {
        let finalImageUrl = "";
        if (imageFile) {
          finalImageUrl = await uploadImage(imageFile);
        } else {
          alert("Сураныч, сүрөт тандаңыз!");
          setLoading(false);
          return;
        }

        await addDoc(collection(db, activeTab), {
          title,
          description: desc,
          imageUrl: finalImageUrl,
          date: new Date().toLocaleDateString('ky-KG'),
          createdAt: serverTimestamp()
        });
        setTitle(''); setDesc(''); setImageFile(null);
        if (document.getElementById('fileInput')) {
            (document.getElementById('fileInput') as HTMLInputElement).value = "";
        }
      }
      alert("Ийгиликтүү сакталды! ✨");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Ката кетти! Кайра аракет кылыңыз.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Бул маалыматты өчүрөсүзбү?")) {
      try {
        await deleteDoc(doc(db, activeTab, id));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert("Өчүрүүдө ката кетти!");
      }
    }
  };

  return (
    <div className={styles.adminWrapper}>
      <motion.aside initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={styles.sidebar}>
        <h2>⚙️ Админ</h2>
        <div className={`${styles.menuItem} ${activeTab === 'news' ? styles.activeMenu : ''}`} onClick={() => setActiveTab('news')}>📰 Жаңылыктар</div>
        <div className={`${styles.menuItem} ${activeTab === 'teachers' ? styles.activeMenu : ''}`} onClick={() => setActiveTab('teachers')}>👨‍🏫 Мугалимдер</div>
        <div className={`${styles.menuItem} ${activeTab === 'schedule' ? styles.activeMenu : ''}`} onClick={() => setActiveTab('schedule')}>📅 Расписание</div>
        <button onClick={() => signOut(auth)} className={styles.logoutBtn}>🚪 Чыгуу</button>
      </motion.aside>

      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
            <h1>
              {activeTab === 'news' && 'Жаңылыктарды башкаруу'}
              {activeTab === 'teachers' && 'Мугалимдерди башкаруу'}
              {activeTab === 'schedule' && 'Расписаниени башкаруу'}
            </h1>

            <form onSubmit={handleSubmit} className={styles.glassCard}>
              {activeTab === 'schedule' ? (
                <>
                  <div className={styles.inputGroup}>
                    <label>Классты тандаңыз</label>
                    <select value={className} onChange={(e) => setClassName(e.target.value)} className={styles.selectInput}>
                      {classList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Апта күнү</label>
                    <select value={day} onChange={(e) => setDay(e.target.value)} className={styles.selectInput}>
                      {["Дүйшөмбү", "Шейшемби", "Шаршемби", "Бейшемби", "Жума", "Ишемби"].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Сабактардын тизмеси</label>
                    <textarea rows={6} value={lessons} onChange={(e) => setLessons(e.target.value)} required placeholder="Мисалы:&#10;1. Эне тили..." />
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.inputGroup}>
                    <label>{activeTab === 'news' ? 'Жаңылыктын темасы' : 'Мугалимдин аты-жөнү'}</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Маалымат</label>
                    <textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Сүрөт жүктөө</label>
                    <div className={styles.fileUploadWrapper}>
                      <input 
                        id="fileInput"
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} 
                        className={styles.fileInputHidden}
                        required 
                      />
                      <label htmlFor="fileInput" className={styles.fileUploadLabel}>
                        {imageFile ? `📁 ${imageFile.name.substring(0, 20)}...` : "📁 Сүрөттү тандаңыз"}
                      </label>
                      
                      {previewUrl && (
                        <div className={styles.previewContainer}>
                          <img src={previewUrl} alt="Preview" className={styles.imagePreview} />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={styles.submitBtn} disabled={loading}>
                {loading ? "Күтө туруңуз..." : "Базага сактоо ✨"}
              </motion.button>
            </form>

            <div className={styles.listSection}>
              <h3>Тизме ({items.length})</h3>
              <div className={styles.adminGrid}>
                {items.map((item) => (
                  <div key={item.id} className={styles.adminCard}>
                    {activeTab !== 'schedule' ? (
                      <>
                        <img src={item.imageUrl} alt={item.title} />
                        <div className={styles.adminCardInfo}>
                          <h4>{item.title}</h4>
                          <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>Өчүрүү 🗑️</button>
                        </div>
                      </>
                    ) : (
                      <div className={styles.adminCardInfo}>
                        <h4 className={styles.classBadge}>{item.className}</h4>
                        <p className={styles.dayText}>{item.day}</p>
                        <div className={styles.lessonPreview}>{item.lessons?.substring(0, 30)}...</div>
                        <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>Өчүрүү 🗑️</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;