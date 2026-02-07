import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Бул жерде жолун туура экенин текшериңиз (мисалы: ../../data/readingData)
import { readingData } from '../../pages/ORTPrep/data/readingData'; 

const ReadingGame = () => {
  const navigate = useNavigate();
  
  // 1. Абал (State) башкаруу
  const [currentTextIdx, setCurrentTextIdx] = useState(0); 
  const [currentQIdx, setCurrentQIdx] = useState(0);       
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // 2. Маалыматты датадан алуу
  const currentData = readingData[currentTextIdx];
  const q = currentData.questions[currentQIdx];

  // 3. Кийинкиге өтүү логикасы
  const handleNext = () => {
    if (currentQIdx < currentData.questions.length - 1) {
      // Ошол эле тексттин кийинки суроосуна өтүү
      setCurrentQIdx(currentQIdx + 1);
    } else if (currentTextIdx < readingData.length - 1) {
      // Кийинки текстке өтүү
      setCurrentTextIdx(currentTextIdx + 1);
      setCurrentQIdx(0);
    } else {
      // Баары бүттү
      alert("Куттуктайбыз! Сиз бардык тесттерди тапшырып бүттүңүз.");
      navigate(-1);
    }
    setSelected(null);
    setShowFeedback(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={backBtnStyle}>← Артка</button>
      
      <div style={{ display: 'flex', gap: '30px', marginTop: '20px', flexWrap: 'wrap' }}>
        {/* Сол жагы: Текст */}
        <div style={textPanelStyle}>
          <h2 style={{ color: '#2d3748' }}>{currentData.title}</h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
            {currentData.text}
          </p>
        </div>

        {/* Оң жагы: Суроолор */}
        <div style={questionPanelStyle}>
          <div style={{ marginBottom: '10px', color: '#718096' }}>
            Текст: {currentTextIdx + 1}/{readingData.length} | Суроо: {currentQIdx + 1}/{currentData.questions.length}
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' }}>{q.question}</p>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            {q.options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => !showFeedback && setSelected(i)}
                style={optionBtnStyle(selected === i, showFeedback && i === q.correct)}
              >
                <b>{String.fromCharCode(65 + i)})</b> {opt}
              </button>
            ))}
          </div>

          {selected !== null && !showFeedback && (
            <button onClick={() => setShowFeedback(true)} style={checkBtnStyle}>Текшерүү</button>
          )}

          {showFeedback && (
            <div style={feedbackBoxStyle}>
              <p><b>Түшүндүрмө:</b> {q.explanation}</p>
              <button onClick={handleNext} style={nextBtnStyle}>
                {currentQIdx < currentData.questions.length - 1 ? "Кийинки суроо" : "Кийинки текст"} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Стилдер
const textPanelStyle = { flex: 1, minWidth: '350px', padding: '25px', background: '#fff', borderRadius: '15px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', maxHeight: '75vh', overflowY: 'auto' as const };
const questionPanelStyle = { flex: 1, minWidth: '350px', padding: '25px', background: '#f7fafc', borderRadius: '15px', border: '1px solid #e2e8f0' };
const backBtnStyle = { padding: '8px 15px', cursor: 'pointer', background: '#edf2f7', border: 'none', borderRadius: '8px', fontWeight: 'bold' as const };
const checkBtnStyle = { marginTop: '20px', width: '100%', padding: '12px', background: '#4299e1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as const };
const feedbackBoxStyle = { marginTop: '20px', padding: '15px', background: '#ebf8ff', borderRadius: '10px', borderLeft: '5px solid #4299e1' };
const nextBtnStyle = { background: '#2d3748', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' };
const optionBtnStyle = (active: boolean, isCorrect: boolean) => ({
  padding: '12px', textAlign: 'left' as const, cursor: 'pointer', borderRadius: '8px', border: active ? '2px solid #4299e1' : '1px solid #cbd5e0',
  background: isCorrect ? '#c6f6d5' : active ? '#ebf8ff' : '#fff', transition: '0.2s'
});

export default ReadingGame;