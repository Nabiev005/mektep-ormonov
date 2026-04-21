import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; 
import { AnimatePresence } from 'framer-motion';

// КОМПОНЕНТТЕР
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
import AIChatBot from './components/AIChatBot/AIChatBot'; 

// БИЛИМ & IT ПАЖАЛАРЫ
import Resources from './pages/Resources/Resources';
import ParentsCorner from './pages/ParentsCorner/ParentsCorner';
import Gallery from './pages/Gallery/Gallery';
import Library from './pages/Library/Library';
import OnlineLessons from './pages/OnlineLessons/OnlineLessons';
import MediaCenter from './pages/MediaCenter/MediaCenter';
import RobotLab from './pages/RobotLab/RobotLab';
import PythonCourse from './pages/PythonCourse/PythonCourse';
import AICourse from './pages/AICourse/AICourse';
import GamedevCourse from './pages/Gamedev/GamedevCourse';
import ORTPrep from './pages/ORTPrep/ORTPrep';

// ОЮНДАР
import DuelGame from './pages/Community/DuelGame/DuelGame';
import WarmWordsPage from "./pages/WarmWords/WarmWords"
import ApricotQuiz from './pages/ApricotQuiz/ApricotQuiz';
import SnakeGame from './pages/SnakeGame/SnakeGame';
import MathSprint from './pages/MathSprint/MathSprint';
import GeoGame from './pages/GeoGame/GeoGame';
import JSGame from "./pages/JSGame/JSGame"
import TypingGame from './pages/TypingGame/TypingGame';
import LogicGame from './pages/LogicGame/LogicGame';

// ЖРТ (ORT) БӨЛҮМДӨРҮ
import AnalogiesGame from './pages/ORTPrep/AnalogiesGame';
import MathGame from './pages/ORTPrep/MathGame';
import Reading from './pages/ORTPrep/Reading';
import GrammarGame from './pages/ORTPrep/GrammarGame';
import Tips from './pages/ORTPrep/Tips';
import Methodology from './pages/ORTPrep/Methodology';

import styles from './App.module.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
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
        {/* Негизги баракчалар */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/best-students" element={<BestStudents />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/parents-corner" element={<ParentsCorner />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/library" element={<Library />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/contact" element={<Contact />} />

        {/* Коомчулук жана IT */}
        <Route path="/community/media-center" element={<MediaCenter />} />
        <Route path="/community/js-game" element={<JSGame />} />
        <Route path="/community/robot-lab" element={<RobotLab />} />
        <Route path="/community/python-course" element={<PythonCourse />} />
        <Route path="/community/ai-course" element={<AICourse />} />
        <Route path="/community/gamedev" element={<GamedevCourse />} />
        <Route path="/online-lessons" element={<OnlineLessons />} />
        <Route path="/community/warm-words" element={<WarmWordsPage />} />

        {/* Оюндар */}
        <Route path="/community/duel-game" element={<DuelGame />} />
        <Route path="/community/apricot-tree" element={<ApricotQuiz />} />
        <Route path="/community/snake-game" element={<SnakeGame />} />
        <Route path="/community/math-sprint" element={<MathSprint />} />
        <Route path="/community/games/geo-master" element={<GeoGame />} />
        <Route path="/community/typing-game" element={<TypingGame />} />
        <Route path="/community/logic-game" element={<LogicGame />} />

        {/* ЖРТ Даярдык */}
        <Route path="/community/ort" element={<ORTPrep />} />
        <Route path="/ort/analogies" element={<AnalogiesGame />} />
        <Route path="/ort/math" element={<MathGame />} />
        <Route path="/ort/reading" element={<Reading />} />
        <Route path="/ort/grammar" element={<GrammarGame />} />
        <Route path="/ort-tips" element={<Tips />} />
        <Route path="/ort/methodology" element={<Methodology />} />
        
        {/* Панелдер */}
        <Route path="/teacher-panel" element={<TeacherPanel />} />
        <Route 
          path="/admin-panel" 
          element={user ? <Dashboard /> : <Login />} 
        /> 
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const layoutStyles = {
    appWrapper: {
      display: 'flex',
      minHeight: '100vh',
      background: '#f8fafc',
    },
    contentArea: {
      // Телефондо сол жактагы боштукту (margin) алып салат
      marginLeft: isMobile ? '0' : '260px', 
      flex: 1,
      display: 'flex',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      flexDirection: 'column' as 'column',
      width: isMobile ? '100%' : 'calc(100% - 260px)',
      transition: 'margin-left 0.3s ease',
    },
    main: {
      flex: 1,
      padding: isMobile ? '60px 15px 20px 15px' : '20px', // Телефондо бургер баскычы үчүн жогорудан боштук
    }
  };

  return (
    <Router>
      <div style={layoutStyles.appWrapper}>
        <Header />
        
        <div style={layoutStyles.contentArea}>
          <main style={layoutStyles.main}>
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>

        <AIChatBot />
      </div>
    </Router>
  );
}

export default App;