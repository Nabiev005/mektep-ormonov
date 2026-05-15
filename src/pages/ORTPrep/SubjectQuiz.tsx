import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../../firebase';
import { recordStudentCourseProgress } from '../../utils/studentAccount';
import { subjectQuizzes } from './data/subjectQuestions';

const SubjectQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { subjectId = '' } = useParams();
  const quiz = subjectQuizzes[subjectId] || subjectQuizzes.history;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const current = quiz.questions[currentIdx];
  const progress = Math.round(((currentIdx + 1) / quiz.questions.length) * 100);

  const saveResult = (nextScore: number, completed: number) => {
    recordStudentCourseProgress(auth.currentUser, {
      source: `ort_${quiz.id}`,
      title: `ОРТ: ${quiz.title}`,
      progressPercent: Math.round((completed / quiz.questions.length) * 100),
      completed,
      total: quiz.questions.length,
      score: nextScore,
      record: nextScore,
      certificateEligible: nextScore >= Math.ceil(quiz.questions.length * 0.8),
    }).catch(() => undefined);
  };

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    const nextScore = index === current.correct ? score + 1 : score;
    setSelected(index);
    setShowFeedback(true);
    setScore(nextScore);
    saveResult(nextScore, currentIdx + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx((value) => value + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const percent = Math.round((score / quiz.questions.length) * 100);
    return (
      <div style={pageStyle}>
        <section style={resultStyle}>
          <span style={{ ...badgeStyle, background: quiz.color }}>ОРТ жыйынтык</span>
          <h1>{quiz.title}</h1>
          <strong style={scoreStyle}>{score}/{quiz.questions.length}</strong>
          <p>{percent >= 80 ? 'Сертификатка даяр жогорку жыйынтык!' : 'Дагы машыгып, жыйынтыкты көтөрүүгө болот.'}</p>
          <button type="button" onClick={() => navigate('/community/ort')} style={{ ...primaryBtn, background: quiz.color }}>
            ОРТ менюга кайтуу
          </button>
        </section>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button type="button" onClick={() => navigate('/community/ort')} style={backBtnStyle}>← ОРТ меню</button>
        <b>{currentIdx + 1}/{quiz.questions.length}</b>
      </div>

      <section style={{ ...cardStyle, borderTop: `6px solid ${quiz.color}` }}>
        <span style={{ ...badgeStyle, background: quiz.color }}>{quiz.title}</span>
        <h1 style={titleStyle}>{current.question}</h1>
        <p style={subtitleStyle}>{quiz.subtitle}</p>

        <div style={progressTrack}>
          <i style={{ ...progressFill, width: `${progress}%`, background: quiz.color }} />
        </div>

        <div style={optionsGrid}>
          {current.options.map((option, index) => {
            const isCorrect = showFeedback && index === current.correct;
            const isWrong = showFeedback && selected === index && index !== current.correct;
            return (
              <button
                key={option}
                type="button"
                disabled={showFeedback}
                onClick={() => handleAnswer(index)}
                style={optionStyle(isCorrect, isWrong, selected === index)}
              >
                <b>{String.fromCharCode(65 + index)}</b>
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div style={feedbackStyle(selected === current.correct)}>
            <h3>{selected === current.correct ? 'Туура жооп' : 'Ката жооп'}</h3>
            <p>{current.explanation}</p>
            <button type="button" onClick={handleNext} style={{ ...primaryBtn, background: quiz.color }}>
              {currentIdx === quiz.questions.length - 1 ? 'Жыйынтык' : 'Кийинки суроо'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

const pageStyle = { maxWidth: '920px', margin: '0 auto', padding: '20px', color: '#0f172a' };
const topBarStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' };
const backBtnStyle = { border: '1px solid #cbd5e1', background: '#fff', borderRadius: '12px', padding: '10px 14px', cursor: 'pointer', fontWeight: 800 };
const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: 'clamp(22px, 4vw, 42px)', boxShadow: '0 22px 55px rgba(15, 23, 42, 0.08)' };
const badgeStyle = { display: 'inline-flex', color: '#fff', borderRadius: '999px', padding: '8px 13px', fontWeight: 900 };
const titleStyle = { margin: '18px 0 8px', fontSize: 'clamp(1.7rem, 4vw, 3rem)', lineHeight: 1.1 };
const subtitleStyle = { color: '#64748b', lineHeight: 1.7, fontWeight: 700 };
const progressTrack = { height: '10px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', margin: '24px 0' };
const progressFill = { display: 'block', height: '100%', borderRadius: 'inherit', transition: 'width 0.2s ease' };
const optionsGrid = { display: 'grid', gap: '12px' };
const optionStyle = (correct: boolean, wrong: boolean, active: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
  borderRadius: '16px',
  border: `2px solid ${correct ? '#22c55e' : wrong ? '#ef4444' : active ? '#60a5fa' : '#e2e8f0'}`,
  background: correct ? '#dcfce7' : wrong ? '#fee2e2' : active ? '#eff6ff' : '#ffffff',
  color: '#0f172a',
  cursor: 'pointer',
  fontWeight: 800,
  textAlign: 'left' as const,
});
const feedbackStyle = (correct: boolean) => ({
  marginTop: '20px',
  padding: '18px',
  borderRadius: '18px',
  border: `1px solid ${correct ? '#86efac' : '#fca5a5'}`,
  background: correct ? '#f0fdf4' : '#fef2f2',
});
const primaryBtn = { border: 'none', color: '#fff', borderRadius: '12px', padding: '12px 18px', cursor: 'pointer', fontWeight: 900 };
const resultStyle = { ...cardStyle, textAlign: 'center' as const };
const scoreStyle = { display: 'block', margin: '18px 0', color: '#2563eb', fontSize: '4rem', lineHeight: 1 };

export default SubjectQuiz;
