import React, { useState, useEffect } from 'react';
import styles from './OnlineLessons.module.css';
import { Play, X, Loader2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface Lesson {
  id: string;
  title: string;
  teacherName: string;
  videoUrl: string;
  description?: string;
}

const OnlineLessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'online-lessons'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lessonsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lesson[];
        setLessons(lessonsData);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Онлайн сабактарды жүктөөдө ката кетти. Интернетти текшерип, кайра аракет кылыңыз.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // YouTube ID алуу жана сүрөтүн чыгаруу функциясы
  const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎥 Онлайн сабактар</h1>
      
      {loading ? (
        <div className={styles.loaderWrapper}><Loader2 className={styles.spinner} size={48} /></div>
      ) : error ? (
        <div className={styles.emptyState}>
          <p>{error}</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {lessons.map((lesson) => {
            const videoId = getYouTubeID(lesson.videoUrl);
            const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';

            return (
              <div key={lesson.id} className={styles.card}>
                <div 
                  className={styles.thumbnailWrapper} 
                  onClick={() => videoId && setSelectedVideo(videoId)}
                >
                  <img src={thumbnailUrl} alt={lesson.title} className={styles.thumbnail} />
                  <div className={styles.playOverlay}><Play fill="white" size={40} /></div>
                </div>
                
                <div className={styles.cardContent}>
                  <span className={styles.subjectTag}>Видео сабак</span>
                  <h3>{lesson.title}</h3>
                  <p>Мугалим: <strong>{lesson.teacherName}</strong></p>
                  <button 
                    onClick={() => videoId && setSelectedVideo(videoId)} 
                    className={styles.playBtn}
                  >
                    Сабакты көрүү
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Видео Модалдык терезе (Сайттын ичинен көрүү үчүн) */}
      {selectedVideo && (
        <div className={styles.modal} onClick={() => setSelectedVideo(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedVideo(null)}><X size={32} /></button>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineLessons;
