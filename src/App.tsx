import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase'; 
import { AnimatePresence } from 'framer-motion';

// КОМПОНЕНТТЕР
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import AIChatBot from './components/AIChatBot/AIChatBot'; 

import styles from './App.module.css';

const Home = lazy(() => import('./pages/Home/Home'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Teachers = lazy(() => import('./pages/Teachers/Teachers'));
const BestStudents = lazy(() => import('./pages/BestStudents/BestStudents'));
const NewsPage = lazy(() => import('./pages/News/News'));
const About = lazy(() => import('./pages/About/About'));
const Schedule = lazy(() => import('./components/Schedule/Schedule'));
const TeacherPanel = lazy(() => import('./pages/Teacher/TeacherPanel'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Login = lazy(() => import('./pages/Admin/Login'));
const Resources = lazy(() => import('./pages/Resources/Resources'));
const ParentsCorner = lazy(() => import('./pages/ParentsCorner/ParentsCorner'));
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
const Library = lazy(() => import('./pages/Library/Library'));
const OnlineLessons = lazy(() => import('./pages/OnlineLessons/OnlineLessons'));
const MediaCenter = lazy(() => import('./pages/MediaCenter/MediaCenter'));
const RobotLab = lazy(() => import('./pages/RobotLab/RobotLab'));
const PythonCourse = lazy(() => import('./pages/PythonCourse/PythonCourse'));
const AICourse = lazy(() => import('./pages/AICourse/AICourse'));
const GamedevCourse = lazy(() => import('./pages/Gamedev/GamedevCourse'));
const ORTPrep = lazy(() => import('./pages/ORTPrep/ORTPrep'));
const DuelGame = lazy(() => import('./pages/Community/DuelGame/DuelGame'));
const WarmWordsPage = lazy(() => import('./pages/WarmWords/WarmWords'));
const ApricotQuiz = lazy(() => import('./pages/ApricotQuiz/ApricotQuiz'));
const SnakeGame = lazy(() => import('./pages/SnakeGame/SnakeGame'));
const MathSprint = lazy(() => import('./pages/MathSprint/MathSprint'));
const GeoGame = lazy(() => import('./pages/GeoGame/GeoGame'));
const JSGame = lazy(() => import('./pages/JSGame/JSGame'));
const TypingGame = lazy(() => import('./pages/TypingGame/TypingGame'));
const LogicGame = lazy(() => import('./pages/LogicGame/LogicGame'));
const AnalogiesGame = lazy(() => import('./pages/ORTPrep/AnalogiesGame'));
const MathGame = lazy(() => import('./pages/ORTPrep/MathGame'));
const Reading = lazy(() => import('./pages/ORTPrep/Reading'));
const GrammarGame = lazy(() => import('./pages/ORTPrep/GrammarGame'));
const Tips = lazy(() => import('./pages/ORTPrep/Tips'));
const Methodology = lazy(() => import('./pages/ORTPrep/Methodology'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

const AnimatedRoutes = () => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
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
      <Suspense fallback={<div className={styles.loader}>Баракча жүктөлүүдө...</div>}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

function App() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

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
      marginLeft: isMobile ? '0' : isHeaderExpanded ? '292px' : '76px',
      flex: 1,
      display: 'flex',
      // eslint-disable-next-line @typescript-eslint/prefer-as-const
      flexDirection: 'column' as 'column',
      width: isMobile ? '100%' : isHeaderExpanded ? 'calc(100% - 292px)' : 'calc(100% - 76px)',
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
        <Header onExpandedChange={setIsHeaderExpanded} />
        
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
