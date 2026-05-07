import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mathQuestions } from './data/mathQuestions';

const MathGame = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 мүнөт

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const q = mathQuestions[currentIdx];

  const handleAnswer = (ans: string) => {
    setSelected(ans);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelected(null);
    if (currentIdx < mathQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      alert("Тест аяктады!");
      navigate(-1);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Жогорку панель */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => navigate(-1)} style={backBtnStyle}>← Артка</button>
        <div style={timerStyle(timeLeft < 60)}>
          Убакыт: {formatTime(timeLeft)}
        </div>
      </div>

      <h2 style={{ textAlign: 'center', color: '#2d3748' }}>Математика: Салыштыруу</h2>
      
      {/* Кошумча шарт болсо көрсөтүлөт */}
      {q.condition && (
        <div style={conditionStyle}>Шарт: <b>{q.condition}</b></div>
      )}

      {/* А жана Б Колонкалары */}
      <div style={columnsContainer}>
        <div style={columnBox}>
          <div style={columnHeader}>А колонкасы</div>
          <div style={columnBody}>{q.columnA}</div>
        </div>
        <div style={columnBox}>
          <div style={columnHeader}>Б колонкасы</div>
          <div style={columnBody}>{q.columnB}</div>
        </div>
      </div>

      {/* Жооп варианттары */}
      <div style={optionsGrid}>
        <button onClick={() => !showFeedback && handleAnswer('A')} style={btnStyle(selected === 'A', q.correct === 'A', showFeedback)}>А чоң</button>
        <button onClick={() => !showFeedback && handleAnswer('B')} style={btnStyle(selected === 'B', q.correct === 'B', showFeedback)}>Б чоң</button>
        <button onClick={() => !showFeedback && handleAnswer('Equal')} style={btnStyle(selected === 'Equal', q.correct === 'Equal', showFeedback)}>Барабар</button>
        <button onClick={() => !showFeedback && handleAnswer('NotEnough')} style={btnStyle(selected === 'NotEnough', q.correct === 'NotEnough', showFeedback)}>Жетишсиз</button>
      </div>

      {/* Түшүндүрмө */}
      {showFeedback && (
        <div style={feedbackStyle(selected === q.correct)}>
          <h4 style={{ margin: '0 0 10px 0' }}>{selected === q.correct ? "Туура! 🎉" : "Ката! ❌"}</h4>
          <p>{q.explanation}</p>
          <button onClick={nextQuestion} style={nextBtn}>Кийинки суроо →</button>
        </div>
      )}
    </div>
  );
};

// --- Стилдер (Толук вариант) ---

const columnsContainer = { display: 'flex', gap: '20px', marginBottom: '30px' };

const columnBox = { 
  flex: 1, 
  border: '2px solid #4299e1', 
  borderRadius: '12px', 
  overflow: 'hidden',
  backgroundColor: '#fff',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const columnHeader = { 
  background: '#4299e1', 
  color: 'white', 
  padding: '12px', 
  textAlign: 'center' as const,
  fontWeight: 'bold'
};

const columnBody = { 
  padding: '50px 20px', 
  textAlign: 'center' as const, 
  fontSize: '1.8rem', 
  fontWeight: 'bold',
  color: '#2d3748'
};

const conditionStyle = { 
  background: '#fff5f5', 
  padding: '15px', 
  borderRadius: '8px', 
  textAlign: 'center' as const, 
  marginBottom: '20px', 
  border: '1px solid #feb2b2',
  fontSize: '1.1rem'
};

const optionsGrid = { 
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  gap: '15px' 
};

const backBtnStyle = {
  padding: '8px 18px',
  cursor: 'pointer',
  background: '#f7fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontWeight: 'bold',
  color: '#4a5568',
  transition: 'all 0.2s'
};

const timerStyle = (isUrgent: boolean) => ({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: isUrgent ? '#e53e3e' : '#2d3748',
  padding: '8px 20px',
  borderRadius: '10px',
  background: isUrgent ? '#fff5f5' : '#f0f4f8',
  border: `2px solid ${isUrgent ? '#f56565' : '#cbd5e0'}`
});

const nextBtn = { 
  padding: '12px 25px', 
  cursor: 'pointer', 
  background: '#2d3748', 
  color: '#fff', 
  border: 'none', 
  borderRadius: '8px',
  marginTop: '15px',
  fontWeight: 'bold'
};

const btnStyle = (isSelected: boolean, isCorrect: boolean, showFeedback: boolean) => ({
  padding: '18px',
  cursor: 'pointer',
  borderRadius: '10px',
  border: '2px solid #e2e8f0',
  fontSize: '1.1rem',
  fontWeight: '500',
  transition: 'all 0.2s',
  backgroundColor: showFeedback 
    ? (isCorrect ? '#c6f6d5' : isSelected ? '#fed7d7' : '#fff') 
    : (isSelected ? '#ebf8ff' : '#fff'),
  borderColor: showFeedback
    ? (isCorrect ? '#48bb78' : isSelected ? '#f56565' : '#e2e8f0')
    : (isSelected ? '#4299e1' : '#e2e8f0')
});

const feedbackStyle = (correct: boolean) => ({
  marginTop: '25px',
  padding: '20px',
  borderRadius: '12px',
  backgroundColor: correct ? '#f0fff4' : '#fff5f5',
  border: `1px solid ${correct ? '#48bb78' : '#f56565'}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
});

export default MathGame;
