import React, { useState, useEffect, useRef } from 'react';
import { db, auth, storage } from '../../firebase'; // storage кошулду
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, serverTimestamp, getCountFromServer, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage үчүн
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Admin.module.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ListItem {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  pdfUrl?: string; // PDF шилтемеси үчүн жаңы талаа
  className?: string;
  day?: string;
  lessons?: string;
  date?: string;
  category?: string;
  email?: string; 
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('achievements');
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [pdfFile, setPdfFile] = useState<File | null>(null); // PDF файл үчүн жаңы state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [className, setClassName] = useState('1-класс');
  const [day, setDay] = useState('Дүйшөмбү');
  const [lessons, setLessons] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ListItem[]>([]);
  
  const [stats, setStats] = useState({ 
    news: 0, 
    teachers: 0, 
    schedule: 0, 
    bestStudents: 0, 
    feedback: 0, 
    gallery: 0,
    library: 0 
  });

  const certificateRef = useRef<HTMLDivElement>(null);
  const [certData, setCertData] = useState({
    name: '',
    reason: '',
    longDescription: '',
    event: '',
    director: 'З.Ормонов',
    date: new Date().toLocaleDateString('ky-KG')
  });

  const IMGBB_API_KEY = '9aed8b9d3a6c54c6a68db494ac681c35';
  const classList = ["1-класс", "2-класс", "3-класс", "4-класс", "5-класс", "6-класс", "7-класс", "8-класс", "9-класс", "10-класс", "11-класс"];

  const fetchStats = async () => {
    try {
      const newsCount = await getCountFromServer(collection(db, 'news'));
      const teachersCount = await getCountFromServer(collection(db, 'teachers'));
      const scheduleCount = await getCountFromServer(collection(db, 'schedule'));
      const bestStudentsCount = await getCountFromServer(collection(db, 'best-students'));
      const feedbackCount = await getCountFromServer(collection(db, 'feedback'));
      const galleryCount = await getCountFromServer(collection(db, 'gallery'));
      const libraryCount = await getCountFromServer(collection(db, 'library'));
      
      setStats({
        news: newsCount.data().count,
        teachers: teachersCount.data().count,
        schedule: scheduleCount.data().count,
        bestStudents: bestStudentsCount.data().count,
        feedback: feedbackCount.data().count,
        gallery: galleryCount.data().count,
        library: libraryCount.data().count
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
    if (activeTab === 'stats' || activeTab === 'certificate') return;

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

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`Сертификат_${certData.name}.pdf`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("PDF жүктөөдө ката кетти");
    }
    setLoading(false);
  };

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

  // PDFти Firebase'ге жүктөө функциясы
  const uploadPDFFile = async (file: File) => {
    const storageRef = ref(storage, `library_pdfs/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
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

        // PDF жүктөө логикасы
        let currentPdfUrl = items.find(i => i.id === editingId)?.pdfUrl || "";
        if (activeTab === 'library' && pdfFile) {
          currentPdfUrl = await uploadPDFFile(pdfFile);
        }

        finalData = {
          title,
          description: desc,
          category: activeTab === 'news' ? category : 
                    activeTab === 'gallery' ? 'gallery' : 
                    activeTab === 'best-students' ? 'student' : 
                    activeTab === 'library' ? 'book' : 'teacher',
          imageUrl: currentImageUrl,
          pdfUrl: currentPdfUrl, // Бул жерге PDF шилтемеси сакталат
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
      
      setTitle(''); setDesc(''); setLessons(''); setImageFile(null); setPdfFile(null); setPreviewUrl(null);
      if (document.getElementById('fileInput')) {
        (document.getElementById('fileInput') as HTMLInputElement).value = "";
      }
      if (document.getElementById('pdfInput')) {
        (document.getElementById('pdfInput') as HTMLInputElement).value = "";
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
    const searchStr = (item.title || item.className || item.description || '').toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.adminWrapper}>
      <motion.aside initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={styles.sidebar}>
        <h2>⚙️ Админ</h2>
        <div className={`${styles.menuItem} ${activeTab === 'stats' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('stats'); setEditingId(null);}}>📊 Статистика</div>
        <div className={`${styles.menuItem} ${activeTab === 'news' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('news'); setEditingId(null);}}>📰 Жаңылыктар</div>
        <div className={`${styles.menuItem} ${activeTab === 'gallery' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('gallery'); setEditingId(null);}}>📸 Галерея</div>
        <div className={`${styles.menuItem} ${activeTab === 'library' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('library'); setEditingId(null);}}>📚 Китепкана</div>
        <div className={`${styles.menuItem} ${activeTab === 'teachers' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('teachers'); setEditingId(null);}}>👨‍🏫 Мугалимдер</div>
        <div className={`${styles.menuItem} ${activeTab === 'best-students' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('best-students'); setEditingId(null);}}>🌟 Мыктылар</div>
        <div className={`${styles.menuItem} ${activeTab === 'schedule' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('schedule'); setEditingId(null);}}>📅 Расписание</div>
        <div className={`${styles.menuItem} ${activeTab === 'feedback' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('feedback'); setEditingId(null);}}>💬 Пикирлер</div>
        <div className={`${styles.menuItem} ${activeTab === 'certificate' ? styles.activeMenu : ''}`} onClick={() => {setActiveTab('certificate'); setEditingId(null);}}>📜 Сертификат жасоо</div>
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
                      <div className={styles.barLine} style={{ height: `${Math.min(stats.news * 5, 100)}%`, background: '#3182ce' }}></div>
                      <span>Жаңылык</span>
                    </div>
                    <div className={styles.barWrapper}>
                      <div className={styles.barLine} style={{ height: `${Math.min(stats.library * 5, 100)}%`, background: '#ed8936' }}></div>
                      <span>Китептер</span>
                    </div>
                    <div className={styles.barWrapper}>
                      <div className={styles.barLine} style={{ height: `${Math.min(stats.gallery * 5, 100)}%`, background: '#9f7aea' }}></div>
                      <span>Галерея</span>
                    </div>
                    <div className={styles.barWrapper}>
                      <div className={styles.barLine} style={{ height: `${Math.min(stats.teachers * 5, 100)}%`, background: '#38a169' }}></div>
                      <span>Мугалим</span>
                    </div>
                  </div>
                  <div className={styles.quickActionsSection}>
                    <h4>🚀 Ыкчам аракеттер</h4>
                    <div className={styles.actionBtns}>
                      <button onClick={() => setActiveTab('news')}>+ Жаңылык</button>
                      <button onClick={() => setActiveTab('library')}>+ Китеп кошуу</button>
                      <button onClick={() => setActiveTab('gallery')}>+ Сүрөт кошуу</button>
                    </div>
                  </div>
                </div>

                <div className={styles.statSummary}>
                  <div className={styles.miniCard}><h4>{stats.news}</h4><p>Жаңылыктар</p></div>
                  <div className={styles.miniCard}><h4>{stats.library}</h4><p>Китептер</p></div>
                  <div className={styles.miniCard}><h4>{stats.gallery}</h4><p>Сүрөттөр</p></div>
                  <div className={styles.systemStatusCard}>
                    <h4>💻 Статус</h4>
                    <div className={styles.statusItem}>
                      <span>Админ:</span>
                      <p>{auth.currentUser?.email?.split('@')[0]}</p>
                    </div>
                    <div className={styles.statusItem}>
                      <span>Абалы:</span>
                      <p className={styles.onlineStatus}>Онлайн</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'certificate' ? (
            <motion.div key="certificate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1>📜 Сертификат генератору</h1>
              <div className={styles.certificateLayout}>
                <div className={styles.certForm}>
                  <div className={styles.inputGroup}>
                    <label>Аты-жөнү (Кимге)</label>
                    <input type="text" value={certData.name} onChange={(e) => setCertData({...certData, name: e.target.value})} placeholder="Асанов Үсөн" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Номинация / Себеби</label>
                    <input type="text" value={certData.reason} onChange={(e) => setCertData({...certData, reason: e.target.value})} placeholder="I ОРУН" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Толук маалымат</label>
                    <textarea rows={3} value={certData.longDescription} onChange={(e) => setCertData({...certData, longDescription: e.target.value})} placeholder="Бул сертификат окуудагы ийгиликтери үчүн берилет..." />
                  </div>
                  <button onClick={downloadCertificate} className={styles.submitBtn} disabled={loading || !certData.name}>
                    {loading ? "Даярдалууда..." : "PDF Жүктөө ⬇️"}
                  </button>
                </div>
                <div className={styles.certPreviewWrapper}>
                  <div ref={certificateRef} className={styles.certificateTemplate}>
                    <div className={styles.certBorderOuter}>
                      <div className={styles.certBorderInner}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Emblem_of_Kyrgyzstan.svg/1200px-Emblem_of_Kyrgyzstan.svg.png" alt="Герб" className={styles.certEmblem} />
                        <span className={styles.certSchoolName}>ЗАЙИЛ ОРМОНОВ АТЫНДАГЫ ОРТО МЕКТЕБИ</span>
                        <h2 className={styles.certGoldTitle}>СЕРТИФИКАТ</h2>
                        <h3 className={styles.certRecipient}>{certData.name || "Аты-жөнү"}</h3>
                        <div className={styles.badge}>{certData.reason || "Номинация"}</div>
                        <p className={styles.certText}>{certData.longDescription || "Сыйлоо тексти"}</p>
                        <div className={styles.certFooter}>
                          <div><p>Директор:</p><p className={styles.signLine}>{certData.director}</p></div>
                          <div className={styles.certStamp}>М.О.</div>
                          <div><p>Дата:</p><p><strong>{certData.date}</strong></p></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'feedback' ? (
            <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1>💬 Колдонуучулардын пикирлери</h1>
              <div className={styles.listSection}>
                <div className={styles.listHeader}>
                   <h3>Каттардын тизмеси ({filteredItems.length})</h3>
                   <input type="text" placeholder="🔍 Издөө..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className={styles.adminGrid}>
                  {filteredItems.map((item) => (
                    <div key={item.id} className={styles.glassCard} style={{padding: '20px', marginBottom: '15px', width: '100%'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                          <h4>👤 {item.title}</h4>
                          <p>📧 {item.email} | 📅 {item.date}</p>
                          <p style={{fontStyle: 'italic'}}>"{item.description}"</p>
                        </div>
                        <button onClick={() => handleDelete(item.id)} className={styles.deleteBtnMini}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key={activeTab} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
              <h1>
                {editingId ? '✏️ Оңдоо' : 
                 activeTab === 'best-students' ? '➕ Жаңы мыкты окуучу' : 
                 activeTab === 'teachers' ? '➕ Жаңы мугалим' : 
                 activeTab === 'gallery' ? '📸 Галереяга сүрөт кошуу' : 
                 activeTab === 'library' ? '📚 Жаңы китеп кошуу' : '➕ Жаңы кошуу'}
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
                         activeTab === 'gallery' ? 'Сүрөттүн аталышы' :
                         activeTab === 'best-students' ? 'Окуучунун аты-жөнү' : 
                         activeTab === 'library' ? 'Китептин аталышы жана автору' : 'Мугалимдин аты-жөнү'}
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
                      <label>{activeTab === 'best-students' ? 'Жетишкендиктери' : activeTab === 'library' ? 'Китеп жөнүндө кыскача' : 'Маалымат'}</label>
                      <textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} required />
                    </div>
                    
                    {/* Сүрөт жүктөө бөлүмү */}
                    <div className={styles.inputGroup}>
                      <label>Сүрөт {activeTab === 'library' ? '(Мукабасы)' : ''}</label>
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

                    {/* КИТЕПКАНА ҮЧҮН PDF ЖҮКТӨӨ ТАЛААСЫ */}
                    {activeTab === 'library' && (
                      <div className={styles.inputGroup}>
                        <label>Китептин PDF файлы</label>
                        <input id="pdfInput" type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)} className={styles.fileInputHidden} />
                        <label htmlFor="pdfInput" className={styles.fileUploadLabel} style={{background: '#2d3748', border: '1px solid #4a5568'}}>
                          {pdfFile ? `📕 ${pdfFile.name.substring(0, 25)}...` : "📕 PDF файлды тандаңыз"}
                        </label>
                      </div>
                    )}
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
                  <input type="text" placeholder="🔍 Издөө..." className={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                
                <div className={styles.adminGrid}>
                  {filteredItems.map((item) => (
                    <motion.div layout key={item.id} className={styles.adminCard}>
                      {activeTab !== 'schedule' ? (
                        <>
                          <img src={item.imageUrl} alt={item.title} />
                          <div className={styles.adminCardInfo}>
                            <h4>{item.title}</h4>
                            {/* Эгер PDF болсо, белги коюп коёт */}
                            {item.pdfUrl && <span style={{fontSize: '10px', color: '#48bb78'}}>📕 PDF файл жүктөлгөн</span>}
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
                          <div className={styles.cardActions}>
                            <button onClick={() => handleEdit(item)} className={styles.editBtn}>✏️</button>
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
        
        {/* Modal */}
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
                  {/* Модалда PDFти көрүү баскычы */}
                  {selectedItem.pdfUrl && (
                    <a href={selectedItem.pdfUrl} target="_blank" rel="noreferrer" className={styles.submitBtn} style={{display: 'inline-block', marginTop: '10px', textDecoration: 'none', textAlign: 'center'}}>
                      📕 Китепти окуу (PDF)
                    </a>
                  )}
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