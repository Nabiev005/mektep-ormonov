import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, serverTimestamp, getCountFromServer, updateDoc } from 'firebase/firestore';
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
  category?: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('achievements');
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [className, setClassName] = useState('1-класс');
  const [day, setDay] = useState('Дүйшөмбү');
  const [lessons, setLessons] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ListItem[]>([]);
  const [stats, setStats] = useState({ news: 0, teachers: 0, schedule: 0, bestStudents: 0 });

  const IMGBB_API_KEY = '9aed8b9d3a6c54c6a68db494ac681c35';
  const classList = ["1-класс", "2-класс", "3-класс", "4-класс", "5-класс", "6-класс", "7-класс", "8-класс", "9-класс", "10-класс", "11-класс"];

  const fetchStats = async () => {
    try {
      const newsCount = await getCountFromServer(collection(db, 'news'));
      const teachersCount = await getCountFromServer(collection(db, 'teachers'));
      const scheduleCount = await getCountFromServer(collection(db, 'schedule'));
      const bestStudentsCount = await getCountFromServer(collection(db, 'best-students'));
      
      setStats({
        news: newsCount.data().count,
        teachers: teachersCount.data().count,
        schedule: scheduleCount.data().count,
        bestStudents: bestStudentsCount.data().count
      });
    } catch (e) {
      console.error("Статистика алууда ката:", e);
    }
  };

  useEffect(() => {
    if (!imageFile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!editingId) setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile, editingId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
    if (activeTab === 'stats') return;

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

  const handleEdit = (item: ListItem) => {
    setEditingId(item.id);
    if (activeTab === 'schedule') {
      setClassName(item.className || '1-класс');
      setDay(item.day || 'Дүйшөмбү');
      setLessons(item.lessons || '');
    } else {
      setTitle(item.title || '');
      setDesc(item.description || '');
      setCategory(item.category || 'achievements');
      setPreviewUrl(item.imageUrl || null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let finalData: any = {};
      
      if (activeTab === 'schedule') {
        finalData = {
          className, day, lessons,
          updatedAt: serverTimestamp()
        };
      } else {
        let currentImageUrl = previewUrl;
        if (imageFile) {
          currentImageUrl = await uploadImage(imageFile);
        }

        finalData = {
          title,
          description: desc,
          category: activeTab === 'news' ? category : activeTab === 'best-students' ? 'student' : 'teacher',
          imageUrl: currentImageUrl,
          updatedAt: serverTimestamp()
        };
      }

      if (editingId) {
        await updateDoc(doc(db, activeTab, editingId), finalData);
        setEditingId(null);
      } else {
        finalData.createdAt = serverTimestamp();
        finalData.date = new Date().toLocaleDateString('ky-KG');
        await addDoc(collection(db, activeTab), finalData);
      }
      
      setTitle(''); setDesc(''); setLessons(''); setImageFile(null); setPreviewUrl(null);
      if (document.getElementById('fileInput')) {
        (document.getElementById('fileInput') as HTMLInputElement).value = "";
      }
      alert("Ийгиликтүү сакталды! ✨");
      fetchStats();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Ката кетти!");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Бул маалыматты өчүрөсүзбү?")) {
      try {
        await deleteDoc(doc(db, activeTab, id));
        fetchStats();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert("Өчүрүүдө ката кетти!");
      }
    }
  };

  const filteredItems = items.filter(item => {
    const searchStr = (item.title || item.className || '').toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.adminWrapper}>
      <motion.aside initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={styles.sidebar}>
        <h2>⚙️ Админ</h2>
        <div className={`${styles.menuItem} ${activeTab === 'stats' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('stats'); setEditingId(null);}}>📊 Статистика</div>
        <div className={`${styles.menuItem} ${activeTab === 'news' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('news'); setEditingId(null);}}>📰 Жаңылыктар</div>
        <div className={`${styles.menuItem} ${activeTab === 'teachers' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('teachers'); setEditingId(null);}}>👨‍🏫 Мугалимдер</div>
        <div className={`${styles.menuItem} ${activeTab === 'best-students' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('best-students'); setEditingId(null);}}>🌟 Мыктылар</div>
        <div className={`${styles.menuItem} ${activeTab === 'schedule' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('schedule'); setEditingId(null);}}>📅 Расписание</div>
        <button onClick={() => signOut(auth)} className={styles.logoutBtn}>🚪 Чыгуу</button>
      </motion.aside>

      <main className={styles.mainContent}>
        <AnimatePresence mode="wait">
          {activeTab === 'stats' ? (
            <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h1>Мектептин статистикасы</h1>
              <div className={styles.statsPageGrid}>
                <div className={styles.statInfoCard}>
                  <h3>Системадагы маалыматтар</h3>
                  <div className={styles.barChartContainer}>
                    <div className={styles.barWrapper}>
                      <div className={styles.barLine} style={{ height: `${Math.min(stats.news * 10, 100)}%`, background: '#3182ce' }}></div>
                      <span>Жаңылык</span>
                    </div>
                    <div className={styles.barWrapper}>
                      <div className={styles.barLine} style={{ height: `${Math.min(stats.teachers * 10, 100)}%`, background: '#38a169' }}></div>
                      <span>Мугалим</span>
                    </div>
                    <div className={styles.barWrapper}>
                      <div className={styles.barLine} style={{ height: `${Math.min(stats.bestStudents * 10, 100)}%`, background: '#ecc94b' }}></div>
                      <span>Мыктылар</span>
                    </div>
                  </div>

                  {/* ТОЛУКТОО: Ыкчам аракеттер */}
                  <div className={styles.quickActionsSection}>
                    <h4>🚀 Ыкчам аракеттер</h4>
                    <div className={styles.actionBtns}>
                      <button onClick={() => setActiveTab('news')}>+ Жаңылык</button>
                      <button onClick={() => setActiveTab('best-students')}>+ Мыкты окуучу</button>
                      <button onClick={() => setActiveTab('teachers')}>+ Мугалим</button>
                    </div>
                  </div>
                </div>

                <div className={styles.statSummary}>
                  <div className={styles.miniCard}><h4>{stats.news}</h4><p>Жаңылыктар</p></div>
                  <div className={styles.miniCard}><h4>{stats.teachers}</h4><p>Мугалимдер</p></div>
                  <div className={styles.miniCard}><h4>{stats.bestStudents}</h4><p>Мыктылар</p></div>
                  
                  {/* ТОЛУКТОО: Системанын абалы */}
                  <div className={styles.systemStatusCard}>
                    <h4>💻 Статус</h4>
                    <div className={styles.statusItem}>
                      <span>Админ:</span>
                      <p>{auth.currentUser?.email?.split('@')[0]}</p>
                    </div>
                    <div className={styles.statusItem}>
                      <span>Абалы:</span>
                      <p className={styles.onlineStatus}>● Онлайн</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
              <h1>
                {editingId ? '✏️ Оңдоо' : 
                 activeTab === 'best-students' ? '➕ Жаңы мыкты окуучу' : 
                 activeTab === 'teachers' ? '➕ Жаңы мугалим' : '➕ Жаңы кошуу'}
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
                      <textarea rows={6} value={lessons} onChange={(e) => setLessons(e.target.value)} required placeholder="1. Математика..." />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.inputGroup}>
                      <label>
                        {activeTab === 'news' ? 'Жаңылыктын темасы' : 
                         activeTab === 'best-students' ? 'Окуучунун аты-жөнү' : 'Мугалимдин аты-жөнү'}
                      </label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    {activeTab === 'news' && (
                      <div className={styles.inputGroup}>
                        <label>Бөлүмдү тандаңыз</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.selectInput}>
                          <option value="achievements">🏆 Жетишкендиктер</option>
                          <option value="meetings">🤝 Чогулуштар</option>
                          <option value="sports">🏀 Спорттук оюндар</option>
                        </select>
                      </div>
                    )}
                    <div className={styles.inputGroup}>
                      <label>{activeTab === 'best-students' ? 'Жетишкендиктери' : 'Маалымат'}</label>
                      <textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Сүрөт</label>
                      <input id="fileInput" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className={styles.fileInputHidden} />
                      <label htmlFor="fileInput" className={styles.fileUploadLabel}>
                        {imageFile ? `📁 ${imageFile.name.substring(0, 20)}...` : editingId ? "📷 Сүрөттү алмаштыруу" : "📁 Сүрөттү тандаңыз"}
                      </label>
                      {previewUrl && (
                        <div className={styles.previewContainer}>
                          <img src={previewUrl} alt="Preview" className={styles.imagePreview} />
                        </div>
                      )}
                    </div>
                  </>
                )}
                <div className={styles.formActions}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={styles.submitBtn} disabled={loading}>
                    {loading ? "Күтө туруңуз..." : editingId ? "Жаңыртуу 💾" : "Базага сактоо ✨"}
                  </motion.button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setTitle(''); setDesc(''); setLessons(''); setPreviewUrl(null); }} className={styles.cancelBtn}>
                      Жокко чыгаруу
                    </button>
                  )}
                </div>
              </form>

              <div className={styles.listSection}>
                <div className={styles.listHeader}>
                  <h3>Тизме ({filteredItems.length})</h3>
                  <input 
                    type="text" 
                    placeholder="🔍 Тизмеден издөө..." 
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className={styles.adminGrid}>
                  {filteredItems.map((item) => (
                    <motion.div layout key={item.id} className={styles.adminCard}>
                      {activeTab !== 'schedule' ? (
                        <>
                          <img src={item.imageUrl} alt={item.title} />
                          <div className={styles.adminCardInfo}>
                            <h4>{item.title}</h4>
                            <div className={styles.cardActions}>
                              <button onClick={() => handleEdit(item)} className={styles.editBtn}>Оңдоо ✏️</button>
                              <button onClick={() => {setSelectedItem(item); setIsModalOpen(true);}} className={styles.viewBtn}>👁️</button>
                              <button onClick={() => handleDelete(item.id)} className={styles.deleteBtnMini}>🗑️</button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className={styles.adminCardInfo}>
                          <h4 className={styles.classBadge}>{item.className}</h4>
                          <p className={styles.dayText}>{item.day}</p>
                          <div className={styles.lessonPreview}>{item.lessons?.substring(0, 30)}...</div>
                          <div className={styles.cardActions}>
                            <button onClick={() => handleEdit(item)} className={styles.editBtn}>Оңдоо ✏️</button>
                            <button onClick={() => handleDelete(item.id)} className={styles.deleteBtnMini}>🗑️</button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {isModalOpen && selectedItem && (
            <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>&times;</button>
                <img src={selectedItem.imageUrl} alt={selectedItem.title} className={styles.modalImg} />
                <div className={styles.modalBody}>
                  <h2>{selectedItem.title}</h2>
                  <p className={styles.modalDate}>📅 {selectedItem.date}</p>
                  <div className={styles.modalDesc}>{selectedItem.description}</div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;