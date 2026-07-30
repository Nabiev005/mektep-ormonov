import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot } from 'lucide-react';
import { auth } from '../../firebase';
import { recordStudentCourseProgress } from '../../utils/studentAccount';
import styles from './AITutor.module.css';

type Level = 'simple' | 'standard' | 'deep';

interface ExplainResult {
  simple: string;
  standard: string;
  deep: string;
  checkQuestion: string;
  checkAnswer: string;
}

const LEVEL_LABELS: Record<Level, string> = {
  simple: 'Жөнөкөй',
  standard: 'Орто',
  deep: 'Тереӊ',
};

const AITutor: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [level, setLevel] = useState<Level>('simple');
  const [userAnswer, setUserAnswer] = useState('');
  const [checkStatus, setCheckStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [answeredCount, setAnsweredCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setCheckStatus('idle');
    setUserAnswer('');
    setLevel('simple');

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), subject: subject.trim() }),
      });

      const rawText = await response.text();
      let data: (ExplainResult & { error?: string }) | null = null;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        throw new Error(
          '/api/explain функциясы иштебей жатат. Эгер сиз "npm run dev" менен локалдуу иштетип жатсаңыз, анын ордуна "vercel dev" колдонуңуз — Vite сервери API функцияларын түшүнбөйт.'
        );
      }

      if (!response.ok || !data) {
        throw new Error(data?.error || 'Ката кетти.');
      }

      setResult(data as ExplainResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Түшүндүрмө алууда ката кетти.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = () => {
    if (!result) return;
    const isCorrect = userAnswer.trim().toLowerCase().includes(result.checkAnswer.trim().toLowerCase())
      || result.checkAnswer.trim().toLowerCase().includes(userAnswer.trim().toLowerCase());

    if (isCorrect) {
      setCheckStatus('correct');
      const nextCount = answeredCount + 1;
      setAnsweredCount(nextCount);
      const progressPercent = Math.min(100, nextCount * 10);
      recordStudentCourseProgress(auth.currentUser, {
        source: 'ai_tutor',
        title: 'AI Түшүндүрүүчү',
        progressPercent,
        completed: nextCount,
        total: 10,
        score: nextCount,
      }).catch(() => undefined);
    } else {
      setCheckStatus('wrong');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.badge}><Sparkles size={14} /> Жаңы · AI жардамчы</span>
        <h1>Түшүндүр мага!</h1>
        <p>Каалаган сабак темасын жазыңыз — AI аны 3 деңгээлде (жөнөкөй, орто, тереӊ) түшүндүрөт, андан кийин түшүнгөнүңүздү текшерет.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="ai-topic">Тема *</label>
            <input
              id="ai-topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Мисалы: Фотосинтез, Пифагор теоремасы..."
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="ai-subject">Предмет (кошумча)</label>
            <input
              id="ai-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Мисалы: Биология, Математика..."
            />
          </div>
        </div>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Даярдалууда...' : 'Түшүндүр'}
        </button>
        {error && <div className={styles.errorBox}>{error}</div>}
      </form>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={styles.resultCard}>
          <div className={styles.levelTabs}>
            {(Object.keys(LEVEL_LABELS) as Level[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setLevel(key)}
                className={`${styles.levelTab} ${level === key ? styles.levelTabActive : ''}`}
              >
                {LEVEL_LABELS[key]}
              </button>
            ))}
          </div>

          <p className={styles.explanationText}>{result[level]}</p>

          <div className={styles.checkSection}>
            <h3><Bot size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />Түшүнгөнүңдү текшерели: {result.checkQuestion}</h3>
            <div className={styles.checkRow}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Жообуңузду жазыңыз..."
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              />
              <button type="button" onClick={handleCheck}>Текшерүү</button>
            </div>
            {checkStatus === 'correct' && <p className={styles.checkFeedbackOk}>✅ Туура! Мыкты түшүнгөнсүз.</p>}
            {checkStatus === 'wrong' && <p className={styles.checkFeedbackFail}>❌ Дагы аракет кылыңыз же жогорудагы деӊгээлдерди кайра окуңуз.</p>}
            <p className={styles.progressNote}>Прогресс окуучу панелиңизге сакталат ({answeredCount}/10 туура жооп).</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AITutor;
