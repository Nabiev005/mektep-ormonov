import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Contact from './pages/Contact/Contact';
import Teachers from './pages/Teachers/Teachers';
import NewsPage from './pages/News/News';
import About from './pages/About/About'; // Жаңы кошулду
import Schedule from './components/Schedule/Schedule'; // Расписаниени кошуу
import styles from './App.module.css';
import Footer from './components/Footer/Footer';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} /> {/* Жаңы маршрут */}
        <Route path="/news" element={<NewsPage />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/schedule" element={<Schedule />} /> {/* Расписание үчүн */}
        <Route path="/contact" element={<Contact />} />
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