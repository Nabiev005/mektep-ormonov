import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Firebase файлынан auth'ту импорттоо
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Contact from './pages/Contact/Contact';
import Teachers from './pages/Teachers/Teachers';
import NewsPage from './pages/News/News';
import About from './pages/About/About'; 
import Schedule from './components/Schedule/Schedule'; 
import Dashboard from './pages/Admin/Dashboard'; 
import Login from './pages/Admin/Login'; // ЛОГИН БАРАГЫН ИМПОРТТОО
import Footer from './components/Footer/Footer';
import styles from './App.module.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  // Колдонуучунун киргенин же кирбегенин текшерүү
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
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* АДМИН ПАНЕЛЬ: Эгер кирсе Dashboard, кирбесе Login чыгат */}
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
        <Footer />
      </div>
    </Router>
  );
}

export default App;