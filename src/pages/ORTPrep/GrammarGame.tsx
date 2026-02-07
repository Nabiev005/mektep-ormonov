import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Файлдын жолун өзүңүздүн папкаңызга жараша тактаңыз
import { grammarData } from '../../pages/ORTPrep/data/grammarData'; 

const GrammarGame: React.FC = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Маалымат жок болсо коргоо
  if (!grammarData || grammarData.length === 0) {
    return <div style={{ padding: '20px' }}>Маалымат табылган жок...</div>;
  }

  const q = grammarData[currentIdx];
  const progress = ((currentIdx + 1) / grammarData.length) * 100;

  const handleCheck = (index: number) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
    if (index === q.correct) {
      setScore((prevScore) => prevScore + 10);
    }
  };

  const handleNext = () => {
    if (currentIdx < grammarData.length - 1) {
      setCurrentIdx((prevIdx) => prevIdx + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  const getButtonStyle = (index: number) => {
    let background = '#fff';
    let borderColor = '#e2e8f0';
    let color = '#1a202c';

    if (showFeedback) {
      if (index === q.correct) {
        background = '#c6f6d5'; // Жашыл (Туура)
        borderColor = '#48bb78';
      } else if (selected === index) {
        background = '#fed7d7'; // Кызыл (Ката)
        borderColor = '#f56565';
      }
    } else if (selected === index) {
      background = '#ebf8ff';
      borderColor = '#4299e1';
    }

    return {
      padding: '16px',
      borderRadius: '12px',
      border: `2px solid ${borderColor}`,
      cursor: showFeedback ? 'default' : 'pointer',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      width: '100%',
      textAlign: 'left' as const,
      background,
      color,
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center'
    };
  };

  // Оюн бүткөндөгү экран
  if (isFinished) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '28px', color: '#2d3748' }}>Азаматсыз! 🎉</h2>
          <p style={{ fontSize: '18px', color: '#718096', margin: '20px 0' }}>
            Сиздин жалпы упайыңыз: <br />
            <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#4299e1' }}>{score}</span>
          </p>
          <button 
            onClick={() => navigate(-1)}
            style={{ width: '100%', padding: '15px', background: '#4299e1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Башкы менюга кайтуу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center' }}
        >
          ← Артка кайтуу
        </button>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
          Упай: <span style={{ color: '#4299e1' }}>{score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '10px', marginBottom: '30px', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#4299e1', transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
        <div style={{ color: '#a0aec0', marginBottom: '10px', fontSize: '14px', fontWeight: '500' }}>
          СУРОО {currentIdx + 1} / {grammarData.length}
        </div>
        
        <h3 style={{ marginBottom: '30px', fontSize: '22px', color: '#1a202c', lineHeight: '1.4' }}>
          {q.question}
        </h3>
        
        <div style={{ display: 'grid', gap: '5px' }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleCheck(i)}
              disabled={showFeedback}
              style={getButtonStyle(i)}
            >
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: selected === i ? '#4299e1' : '#f7fafc', 
                color: selected === i ? '#fff' : '#4a5568',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                fontSize: '14px',
                fontWeight: 'bold',
                border: '1px solid #e2e8f0'
              }}>
                {String.fromCharCode(65 + i)}
              </div>
              {opt}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div style={{ 
            marginTop: '25px', 
            padding: '20px', 
            background: '#ebf8ff', 
            borderRadius: '16px', 
            borderLeft: '5px solid #4299e1',
            animation: 'fadeIn 0.5s ease'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2b6cb0' }}>💡 Түшүндүрмө:</h4>
            <p style={{ textAlign: 'left', margin: '0 0 20px 0', color: '#4a5568', lineHeight: '1.5' }}>
              {q.explanation}
            </p>
            <button 
              onClick={handleNext}
              style={{ 
                padding: '14px 25px', 
                background: '#4299e1', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '10px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
              }}
            >
              {currentIdx < grammarData.length - 1 ? "Кийинки суроо →" : "Жыйынтыкты көрүү 🏆"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrammarGame;