import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; 
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Contact from './pages/Contact/Contact';
import Teachers from './pages/Teachers/Teachers';
import BestStudents from './pages/BestStudents/BestStudents'; 
import NewsPage from './pages/News/News';
import About from './pages/About/About'; 
import Schedule from './components/Schedule/Schedule'; 
import TeacherPanel from './pages/Teacher/TeacherPanel';
import Dashboard from './pages/Admin/Dashboard'; 
import Login from './pages/Admin/Login'; 
import Footer from './components/Footer/Footer';

// ЖАҢЫ КОШУЛГАН КОМПОНЕНТТЕР
import AIChatBot from './components/AIChatBot/AIChatBot'; 
import Resources from './pages/Resources/Resources';
import ParentsCorner from './pages/ParentsCorner/ParentsCorner';
import Gallery from './pages/Gallery/Gallery';
import Library from './pages/Library/Library';
import OnlineLessons from './pages/OnlineLessons/OnlineLessons';
import MediaCenter from './pages/MediaCenter/MediaCenter';
import DuelGame from './pages/Community/DuelGame/DuelGame';

import styles from './App.module.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className={styles.loader}>Жүктөлүүдө...</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/best-students" element={<BestStudents />} />
        <Route path="/resources" element={<Resources />} /> {/* <-- ЖАҢЫ МАРШРУТ */}
        <Route path="/parents-corner" element={<ParentsCorner />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/library" element={<Library />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/community/media-center" element={<MediaCenter />} />
        <Route path="/community/duel-game" element={<DuelGame />} />
        <Route path="/online-lessons" element={<OnlineLessons />} />
        <Route path="/teacher-panel" element={<TeacherPanel />} />
        <Route path="/contact" element={<Contact />} />
        
        <Route 
          path="/admin-panel" 
          element={user ? <Dashboard /> : <Login />} 
        /> 
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className={styles.appContainer}>
        <Header />
        
        <main className={styles.mainContent}>
          <AnimatedRoutes />
        </main>

        {/* AI Чат-бот */}
        <AIChatBot />

        <Footer />
      </div>
    </Router>
  );
}

export default App;