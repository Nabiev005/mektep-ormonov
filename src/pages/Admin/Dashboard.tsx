import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Admin.module.css';

interface ListItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ListItem[]>([]);

  // Базадагы маалыматтарды реалдуу убакытта алып туруу
  useEffect(() => {
    const q = query(collection(db, activeTab));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ListItem[];
      setItems(data);
    });

    return () => unsubscribe();
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, activeTab), {
        title,
        description: desc,
        imageUrl,
        date: new Date().toLocaleDateString('ky-KG')
      });
      setTitle(''); setDesc(''); setImageUrl('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Ката кетти!");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Чын эле өчүрөсүзбү?")) {
      try {
        await deleteDoc(doc(db, activeTab, id));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert("Өчүрүүдө ката кетти!");
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className={styles.adminWrapper}>
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={styles.sidebar}
      >
        <h2>⚙️ Мектеп Админ</h2>
        <div 
          className={`${styles.menuItem} ${activeTab === 'news' ? styles.activeMenu : ''}`}
          onClick={() => setActiveTab('news')}
        >
          📰 Жаңылыктар
        </div>
        <div 
          className={`${styles.menuItem} ${activeTab === 'teachers' ? styles.activeMenu : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          👨‍🏫 Мугалимдер
        </div>
        
        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Чыгуу
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <h1>{activeTab === 'news' ? 'Жаңылыктарды башкаруу' : 'Мугалимдерди башкаруу'}</h1>

            {/* Форма */}
            <form onSubmit={handleSubmit} className={styles.glassCard}>
              <div className={styles.inputGroup}>
                <label>Аталышы / Аты-жөнү</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Маалымат</label>
                <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Сүрөт шилтемеси (URL)</label>
                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Сакталууда..." : "Базага кошуу ✨"}
              </motion.button>
            </form>

            {/* Базадагы тизме */}
            <div className={styles.listSection}>
              <h3>Учурдагы тизме ({items.length})</h3>
              <div className={styles.adminGrid}>
                {items.map((item) => (
                  <div key={item.id} className={styles.adminCard}>
                    <img src={item.imageUrl} alt={item.title} />
                    <div className={styles.adminCardInfo}>
                      <h4>{item.title}</h4>
                      <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>
                        Өчүрүү 🗑️
                      </button>
                    </div>
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