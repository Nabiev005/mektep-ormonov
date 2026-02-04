import React, { useState, useEffect } from 'react';

const LogicGame = () => {
  const [problem, setProblem] = useState({ q: '', a: '' });
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(false);
  const [lives, setLives] = useState(3);

  const generateProblem = () => {
    const operators = ['&&', '||'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    const n1 = Math.floor(Math.random() * 20);
    const n2 = Math.floor(Math.random() * 20);
    const n3 = Math.floor(Math.random() * 20);
    const n4 = Math.floor(Math.random() * 20);

    const q = `(${n1} > ${n2}) ${op} (${n3} < ${n4})`;
    const a = eval(q).toString(); // Жөнөкөй эсептөө
    
    setProblem({ q, a });
    setTimeLeft(15);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isActive) {
      handleWrong();
    }
  }, [timeLeft, isActive]);

  const handleWrong = () => {
    setLives(prev => prev - 1);
    if (lives <= 1) {
      alert("Оюн бүттү! Сиздин упайыңыз: " + score);
      setIsActive(false);
      setScore(0);
      setLives(3);
    } else {
      generateProblem();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setUserInput(val);

    if (val === problem.a) {
      setScore(score + 10);
      setUserInput('');
      generateProblem();
    }
  };

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setLives(3);
    generateProblem();
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>ЛОГИКАЛЫК BATTLE ⚡</h1>
      
      {!isActive ? (
        <button onClick={startGame} style={buttonStyle}>БАШТОО</button>
      ) : (
        <div style={gameWrapperStyle}>
          <div style={statsContainerStyle}>
            <p>Убакыт: <span style={{ color: timeLeft < 5 ? '#f56565' : '#4fd1c5' }}>{timeLeft}с</span></p>
            <p>Упай: {score}</p>
            <p style={livesStyle}>Жашоо: {Array(lives).fill('❤️').join('')}</p>
          </div>

          <div style={cardStyle}>
            <h2 style={questionStyle}>{problem.q}</h2>
          </div>

          <div style={inputContainerStyle}>
            <input
              autoFocus
              value={userInput}
              onChange={handleInput}
              placeholder="true / false"
              style={inputStyle}
            />
            <p style={helperTextStyle}>Тез жаз: "true" же "false"</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- АДАПТИВДҮҮ СТИЛДЕР ---

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '20px',
  background: '#1a202c',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontFamily: 'Orbitron, sans-serif',
  boxSizing: 'border-box'
};

const headerStyle: React.CSSProperties = {
  color: '#4fd1c5',
  textShadow: '0 0 10px #4fd1c5',
  fontSize: 'clamp(1.5rem, 8vw, 2.5rem)', // Экранга жараша шрифт өзгөрөт
  marginBottom: '20px'
};

const gameWrapperStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '500px'
};

const statsContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '10px',
  fontSize: 'clamp(0.9rem, 4vw, 1.2rem)',
  marginBottom: '20px',
  padding: '0 10px'
};

const livesStyle: React.CSSProperties = {
  letterSpacing: '2px'
};

const cardStyle: React.CSSProperties = {
  background: '#2d3748',
  padding: 'clamp(20px, 10vw, 50px)',
  borderRadius: '20px',
  marginBottom: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  border: '2px solid #4fd1c5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const questionStyle: React.CSSProperties = {
  fontSize: 'clamp(1.5rem, 7vw, 3rem)', // Суроо экранга баткыдай болот
  margin: 0,
  wordBreak: 'break-word'
};

const inputContainerStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const inputStyle: React.CSSProperties = {
  padding: '15px',
  fontSize: '1.5rem',
  borderRadius: '12px',
  border: '3px solid transparent',
  textAlign: 'center',
  width: '100%',
  maxWidth: '300px',
  outline: 'none',
  backgroundColor: '#fff',
  color: '#000',
  transition: 'border-color 0.3s ease',
  boxSizing: 'border-box'
};

const helperTextStyle: React.CSSProperties = {
  color: '#718096',
  marginTop: '10px',
  fontSize: '0.9rem'
};

const buttonStyle: React.CSSProperties = {
  padding: '15px 50px',
  fontSize: '1.5rem',
  background: '#4fd1c5',
  color: '#1a202c',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 0 15px rgba(79, 209, 197, 0.4)'
};

export default LogicGame;