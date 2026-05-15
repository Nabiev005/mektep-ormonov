import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analogyQuestions } from './data/analogyQuestions';
import { auth } from '../../firebase';
import { recordStudentCourseProgress } from '../../utils/studentAccount';

const AnalogiesGame = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 мүнөт

  // Таймер логикасы
  useEffect(() => {
    if (timeLeft <= 0 || isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQuestion = analogyQuestions[currentIdx];
  const progress = ((currentIdx + 1) / analogyQuestions.length) * 100;

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    if (index === currentQuestion.correct) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
    } else {
      setIsCorrect(false);
    }
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    recordStudentCourseProgress(auth.currentUser, {
      source: 'ort_analogies',
      title: 'ОРТ: Аналогиялар',
      progressPercent: Math.round(((currentIdx + 1) / analogyQuestions.length) * 100),
      completed: currentIdx + 1,
      total: analogyQuestions.length,
      score,
      record: score,
      certificateEligible: score >= Math.ceil(analogyQuestions.length * 0.8),
    }).catch(() => undefined);
    if (currentIdx + 1 < analogyQuestions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartGame = () => {
    setCurrentIdx(0);
    setScore(0);
    setIsFinished(false);
    setShowFeedback(false);
    setSelectedOption(null);
    setTimeLeft(900);
  };

  if (isFinished || timeLeft <= 0) {
    return (
      <div style={resultStyle}>
        <h2>{timeLeft <= 0 ? "Убакыт бүттү! ⏱️" : "Тест аяктады! 🎉"}</h2>
        <p style={{ fontSize: '1.5rem' }}>Сиздин жыйынтык: {score} / {analogyQuestions.length}</p>
        <div style={{ marginBottom: '20px' }}>
          {score > analogyQuestions.length / 2 ? "Азаматсыз! Жакшы жыйынтык. 👍" : "Дагы көбүрөөк даярдануу керек. 💪"}
        </div>
        <button onClick={restartGame} style={nextButtonStyle}>Кайра баштоо</button>
        <button onClick={() => navigate(-1)} style={{ ...nextButtonStyle, backgroundColor: '#718096', marginLeft: '10px' }}>Менюга кайтуу</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Жогорку панель: Артка жана Таймер */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <button onClick={() => navigate(-1)} style={backBtnStyle}>← Артка</button>
        <div style={timerStyle(timeLeft < 60)}>⏱️ {formatTime(timeLeft)}</div>
      </div>

      {/* Прогресс-бар */}
      <div style={progressContainer}>
        <div style={{ ...progressFill, width: `${progress}%` }}></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 'bold' }}>
        <span style={{ color: '#4299e1' }}>Упай: {score}</span>
        <span>Суроо: {currentIdx + 1} / {analogyQuestions.length}</span>
      </div>

      <div style={questionBoxStyle}>
        <h2 style={{ fontSize: '2.2rem', color: '#2d3748', margin: '0' }}>{currentQuestion.pair}</h2>
        <p style={{ color: '#718096', marginTop: '10px' }}>Бул жупка окшош логикалык байланышы бар вариантты тандаңыз:</p>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {currentQuestion.options.map((option, index) => {
          // Түстөрдү аныктоо логикасы
          let bgColor = '#fff';
          let borderColor = '#cbd5e0';
          
          if (showFeedback) {
            if (index === currentQuestion.correct) {
              bgColor = '#c6f6d5'; // Туура жооп - жашыл
              borderColor = '#48bb78';
            } else if (index === selectedOption) {
              bgColor = '#fed7d7'; // Сиз тандаган ката жооп - кызыл
              borderColor = '#f56565';
            }
          } else if (index === selectedOption) {
            bgColor = '#ebf8ff';
            borderColor = '#4299e1';
          }

          return (
            <button
              key={index}
              disabled={showFeedback}
              onClick={() => handleAnswer(index)}
              style={{ ...optionStyle, backgroundColor: bgColor, borderColor: borderColor }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          borderRadius: '12px', 
          backgroundColor: isCorrect ? '#f0fff4' : '#fff5f5',
          borderLeft: `5px solid ${isCorrect ? '#48bb78' : '#f56565'}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: isCorrect ? '#2f855a' : '#c53030', margin: '0 0 10px 0' }}>
            {isCorrect ? "Туура! ✅" : "Ката! ❌"}
          </h3>
          <p style={{ margin: '0 0 15px 0', lineHeight: '1.5', color: '#4a5568' }}>
            <strong>Түшүндүрмө:</strong> {currentQuestion.explanation}
          </p>
          <button onClick={nextQuestion} style={nextButtonStyle}>
            {currentIdx + 1 === analogyQuestions.length ? "Жыйынтыкты көрүү" : "Кийинки суроо →"}
          </button>
        </div>
      )}
    </div>
  );
};

// Стилдер
const backBtnStyle = {
  padding: '8px 15px',
  cursor: 'pointer',
  background: '#f7fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  color: '#4a5568',
  fontWeight: 'bold'
};

const timerStyle = (isUrgent: boolean) => ({
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: isUrgent ? '#e53e3e' : '#2d3748',
  padding: '8px 15px',
  background: isUrgent ? '#fff5f5' : '#f0f4f8',
  borderRadius: '8px',
  border: `1px solid ${isUrgent ? '#feb2b2' : '#cbd5e0'}`
});

const progressContainer = {
  height: '10px',
  backgroundColor: '#e2e8f0',
  borderRadius: '5px',
  marginBottom: '20px',
  overflow: 'hidden'
};

const progressFill = {
  height: '100%',
  backgroundColor: '#4299e1',
  transition: 'width 0.3s ease'
};

const questionBoxStyle = {
  backgroundColor: '#ebf8ff',
  padding: '40px 20px',
  borderRadius: '15px',
  textAlign: 'center' as const,
  marginBottom: '30px',
  border: '2px solid #4299e1',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
};

const optionStyle = {
  padding: '18px',
  fontSize: '1.1rem',
  border: '2px solid #cbd5e0',
  borderRadius: '10px',
  textAlign: 'left' as const,
  transition: 'all 0.2s',
  fontWeight: '500',
  cursor: 'pointer'
};

const nextButtonStyle = {
  padding: '12px 25px',
  backgroundColor: '#4299e1',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 'bold'
};

const resultStyle = {
  textAlign: 'center' as const,
  padding: '50px',
  backgroundColor: '#fff',
  borderRadius: '20px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  maxWidth: '500px',
  margin: '50px auto'
};

export default AnalogiesGame;
