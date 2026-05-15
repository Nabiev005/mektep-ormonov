import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  GraduationCap,
  Languages,
  MessageCircle,
  PenLine,
  PlayCircle,
  Search,
  Sparkles,
  Target,
  Volume2,
  XCircle,
} from 'lucide-react';
import { allWords, alphabet, dialogs, grammarTopics, wordCategories } from './englishData';
import { auth } from '../../firebase';
import { recordStudentCourseProgress } from '../../utils/studentAccount';
import styles from '../TurkishCourse/TurkishCourse.module.css';

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
type CourseSection = 'overview' | 'alphabet' | 'vocabulary' | 'quiz' | 'grammar' | 'dialogs';

const courseSections: Array<{
  id: Exclude<CourseSection, 'overview'>;
  title: string;
  text: string;
  icon: React.ReactNode;
  accent: string;
}> = [
  {
    id: 'alphabet',
    title: 'Алфавит',
    text: 'Тамгаларды угуп, туура окууга көнүгүү.',
    icon: <Languages size={24} />,
    accent: 'blue',
  },
  {
    id: 'vocabulary',
    title: 'Сөздүк сабактар',
    text: 'Категория тандап, сөздөрдү бирден өтүү.',
    icon: <BookOpen size={24} />,
    accent: 'teal',
  },
  {
    id: 'quiz',
    title: 'Тест',
    text: 'Сөздүктөн автоматтык суроолор.',
    icon: <Target size={24} />,
    accent: 'red',
  },
  {
    id: 'grammar',
    title: 'Грамматика',
    text: 'Эң керектүү эрежелер жана мисалдар.',
    icon: <PenLine size={24} />,
    accent: 'violet',
  },
  {
    id: 'dialogs',
    title: 'Диалог',
    text: 'Даяр сүйлөмдөрдү угуп кайталоо.',
    icon: <MessageCircle size={24} />,
    accent: 'amber',
  },
];

const EnglishCourse: React.FC = () => {
  const [activeSection, setActiveSection] = useState<CourseSection>('overview');
  const [activeCategory, setActiveCategory] = useState(wordCategories[0].id);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [quizWord, setQuizWord] = useState(() => allWords[0]);
  const [quizOptions, setQuizOptions] = useState<string[]>(() => shuffle(allWords).slice(0, 4).map((word) => word.en));
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(() => Number(localStorage.getItem('english_score') || 0));
  const [learned, setLearned] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('english_learned_words') || '[]');
    } catch {
      return [];
    }
  });

  const activeWords = useMemo(() => {
    const source = activeCategory === 'all'
      ? allWords
      : wordCategories.find((category) => category.id === activeCategory)?.words || [];

    return source.filter((word) => {
      const text = `${word.ky} ${word.en} ${word.reading} ${word.example}`.toLowerCase();
      return text.includes(searchTerm.toLowerCase());
    });
  }, [activeCategory, searchTerm]);

  const activeCategoryInfo = activeCategory === 'all'
    ? { title: 'Бардык сөздөр', icon: '📚' }
    : wordCategories.find((category) => category.id === activeCategory) || wordCategories[0];
  const lessonWord = activeWords[lessonIndex % Math.max(activeWords.length, 1)] || allWords[0];
  const progress = Math.round((learned.length / allWords.length) * 100);
  const activeSectionTitle = courseSections.find((section) => section.id === activeSection)?.title || 'Курс';

  useEffect(() => {
    recordStudentCourseProgress(auth.currentUser, {
      source: 'english_language',
      title: 'Англис тили',
      progressPercent: progress,
      completed: learned.length,
      total: allWords.length,
      score,
      record: score,
    }).catch(() => undefined);
  }, [learned.length, progress, score]);

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  };

  const toggleLearned = (word: string) => {
    const next = learned.includes(word)
      ? learned.filter((item) => item !== word)
      : [...learned, word];
    setLearned(next);
    localStorage.setItem('english_learned_words', JSON.stringify(next));
  };

  const openSection = (section: CourseSection) => {
    setActiveSection(section);
    if (section === 'vocabulary') {
      setSearchTerm('');
      setLessonIndex(0);
    }
  };

  const startCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    setSearchTerm('');
    setLessonIndex(0);
    setActiveSection('vocabulary');
  };

  const completeLessonWord = () => {
    if (!learned.includes(lessonWord.en)) {
      toggleLearned(lessonWord.en);
    }
    setLessonIndex((current) => current + 1);
  };

  const newQuestion = () => {
    const nextWord = shuffle(allWords)[0];
    const wrongOptions = shuffle(allWords.filter((word) => word.en !== nextWord.en))
      .slice(0, 3)
      .map((word) => word.en);
    setQuizWord(nextWord);
    setQuizOptions(shuffle([nextWord.en, ...wrongOptions]));
    setSelectedAnswer('');
  };

  const checkAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === quizWord.en) {
      const nextScore = score + 1;
      setScore(nextScore);
      localStorage.setItem('english_score', String(nextScore));
    }
  };

  return (
    <div className={styles.page}>
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={styles.hero}>
        <div className={styles.heroText}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              <Languages size={18} />
              English үйрөнүү
            </span>
            <h1>Англис тилин сабак-сабак болуп үйрөн</h1>
            <p>
              Бөлүмдү танда, сөздү угуп кайтала, жооп бер жана прогрессиңди сакта.
              Бул бет окуучу күн сайын кирип, Duolingo сыяктуу аз-аздан өтө турган форматта иштейт.
            </p>
          </div>
          <div className={styles.heroShowcase}>
            <span>Daily sentence</span>
            <strong>I am learning English.</strong>
            <small>Мен англисче үйрөнүп жатам.</small>
            <button type="button" onClick={() => speak('I am learning English')}>
              <Volume2 size={17} />
              Угуу
            </button>
          </div>
        </div>

        <div className={styles.heroStats}>
          <div>
            <BookOpen size={23} />
            <strong>{allWords.length}</strong>
            <span>сөз жана сүйлөм</span>
          </div>
          <div>
            <GraduationCap size={23} />
            <strong>{progress}%</strong>
            <span>өздөштүрүү</span>
          </div>
          <div>
            <Sparkles size={23} />
            <strong>{score}</strong>
            <span>тест упайы</span>
          </div>
        </div>
      </motion.section>

      <section className={styles.progressPanel}>
        <div>
          <span className={styles.kicker}>Прогресс</span>
          <h2>{learned.length} сөз үйрөнүлдү</h2>
          <p>{allWords.length} сөздүн ичинен белгиленгендер. Күн сайын 15-20 сөз жаттасаң, курс тез жүрөт.</p>
        </div>
        <div className={styles.progressVisual}>
          <strong>{progress}%</strong>
          <div className={styles.progressTrack}>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <section className={styles.courseMenu}>
        <div className={styles.sectionHead}>
          <span className={styles.kicker}>Курс бөлүмдөрү</span>
          <h2>Кайсы сабакты өтөсүң?</h2>
        </div>
        <div className={styles.courseGrid}>
          {courseSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={activeSection === section.id ? styles.activeCourseCard : styles.courseCard}
              data-accent={section.accent}
              onClick={() => openSection(section.id)}
            >
              <span>{section.icon}</span>
              <strong>{section.title}</strong>
              <small>{section.text}</small>
              <em>
                Кирүү
                <ArrowRight size={16} />
              </em>
            </button>
          ))}
        </div>
      </section>

      {activeSection === 'overview' && (
        <>
          <section className={styles.lessonHub}>
            <div className={styles.sectionHead}>
              <span className={styles.kicker}>Сөздүк жол картасы</span>
              <h2>Категорияны тандап сабак башта</h2> 
            </div>
            <div className={styles.pathGrid}>
              {wordCategories.map((category, index) => {
                const learnedCount = category.words.filter((word) => learned.includes(word.en)).length;
                const categoryProgress = Math.round((learnedCount / category.words.length) * 100);
                return (
                  <button key={category.id} type="button" className={styles.pathCard} onClick={() => startCategory(category.id)}>
                    <span className={styles.pathNumber}>{index + 1}</span>
                    <span className={styles.pathIcon}>{category.icon}</span>
                    <strong>{category.title}</strong>
                    <small>{category.words.length} сөз · {categoryProgress}%</small>
                    <div className={styles.miniTrack}>
                      <i style={{ width: `${categoryProgress}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className={styles.quickPractice}>
            <div>
              <span className={styles.kicker}>Тез практика</span>
              <h2>Биринчи сөздөн баштайлы</h2>
              <p>Күн сайын аздан өтүп турсаң, прогресс автоматтык сакталат.</p>
            </div>
            <button type="button" onClick={() => startCategory(wordCategories[0].id)}>
              <PlayCircle size={20} />
              Сабак баштоо
            </button>
          </section>
        </>
      )}

      {activeSection !== 'overview' && (
        <section className={styles.lessonStage}>
          <button type="button" className={styles.backBtn} onClick={() => setActiveSection('overview')}>
            <ChevronLeft size={18} />
            Бөлүмдөргө кайтуу
          </button>
          <div className={styles.stageHead}>
            <span className={styles.kicker}>{activeSectionTitle}</span>
            <h2>{activeSection === 'vocabulary' ? activeCategoryInfo.title : activeSectionTitle}</h2>
          </div>

          {activeSection === 'alphabet' && (
            <div className={styles.alphabetGrid}>
              {alphabet.map((item) => (
                <button key={item.letter} type="button" onClick={() => speak(item.example.split(' - ')[0])}>
                  <strong>{item.letter}</strong>
                  <span>{item.sound}</span>
                  <small>{item.example}</small>
                </button>
              ))}
            </div>
          )}

          {activeSection === 'vocabulary' && (
            <>
              <div className={styles.vocabularyStage}>
                <aside className={styles.lessonSidebar}>
                  <span className={styles.kicker}>Сабактар</span>
                  <button
                    type="button"
                    className={activeCategory === 'all' ? styles.activeCategory : styles.categoryBtn}
                    onClick={() => startCategory('all')}
                  >
                    <span>📚</span>
                    Баары ({allWords.length})
                  </button>
                  {wordCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={activeCategory === category.id ? styles.activeCategory : styles.categoryBtn}
                      onClick={() => startCategory(category.id)}
                    >
                      <span>{category.icon}</span>
                      {category.title} ({category.words.length})
                    </button>
                  ))}
                </aside>

                <div className={styles.duoLesson}>
                  <div className={styles.lessonProgress}>
                    <span>{Math.min(lessonIndex + 1, activeWords.length || 1)} / {activeWords.length || 1}</span>
                    <div className={styles.progressTrack}>
                      <span style={{ width: `${activeWords.length ? (((lessonIndex % activeWords.length) + 1) / activeWords.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <div className={styles.lessonCard}>
                    <span className={styles.lessonBadge}>{activeCategoryInfo.icon} {activeCategoryInfo.title}</span>
                    <button type="button" className={styles.bigSoundBtn} onClick={() => speak(lessonWord.en)}>
                      <Volume2 size={30} />
                    </button>
                    <h3>{lessonWord.en}</h3>
                    <strong>{lessonWord.reading}</strong>
                    <p>{lessonWord.ky}</p>
                    <small>{lessonWord.example}</small>
                    <div className={styles.lessonActions}>
                      <button type="button" onClick={() => speak(lessonWord.example)}>
                        <Volume2 size={18} />
                        Сүйлөмдү угуу
                      </button>
                      <button type="button" onClick={completeLessonWord}>
                        <CheckCircle2 size={18} />
                        Үйрөндүм, кийинки
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.wordsPanel}>
                <div className={styles.wordsToolbar}>
                  <div>
                    <span className={styles.kicker}>Сөздүктү карап чыгуу</span>
                    <h2>{activeCategoryInfo.title}</h2>
                  </div>
                  <label className={styles.searchBox}>
                    <Search size={18} />
                    <input
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setLessonIndex(0);
                      }}
                      placeholder="Кыргызча же англисче издөө..."
                    />
                  </label>
                </div>

                <div className={styles.wordsGrid}>
                  {activeWords.map((word) => {
                    const isLearned = learned.includes(word.en);
                    return (
                      <article key={`${word.en}-${word.ky}`} className={isLearned ? styles.learnedCard : styles.wordCard}>
                        <div className={styles.wordTopline}>
                          <small>{word.reading}</small>
                          {isLearned && <em>OK</em>}
                        </div>
                        <button type="button" className={styles.soundBtn} onClick={() => speak(word.en)} aria-label="Угуу">
                          <Volume2 size={18} />
                        </button>
                        <h3>{word.en}</h3>
                        <p>{word.ky}</p>
                        <span>{word.example}</span>
                        <button type="button" className={styles.learnBtn} onClick={() => toggleLearned(word.en)}>
                          {isLearned ? 'Үйрөнүлдү' : 'Үйрөндүм'}
                        </button>
                      </article>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeSection === 'quiz' && (
            <div className={styles.quizCard}>
              <div className={styles.quizTop}>
                <span className={styles.kicker}>Сөздүктөн тест</span>
                <span className={styles.scorePill}><Target size={15} /> {score}</span>
              </div>
              <h2>{quizWord.ky}</h2>
              <p>Бул сөз англисче кандай болот?</p>
              <div className={styles.options}>
                {quizOptions.map((option) => {
                  const isCorrect = selectedAnswer && option === quizWord.en;
                  const isWrong = selectedAnswer === option && option !== quizWord.en;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => checkAnswer(option)}
                      className={isCorrect ? styles.correctOption : isWrong ? styles.wrongOption : styles.optionBtn}
                    >
                      {isCorrect && <CheckCircle2 size={18} />}
                      {isWrong && <XCircle size={18} />}
                      {option}
                    </button>
                  );
                })}
              </div>
              {selectedAnswer && (
                <div className={styles.quizResult}>
                  <strong>{selectedAnswer === quizWord.en ? 'Туура!' : `Туура жооп: ${quizWord.en}`}</strong>
                  <span>{quizWord.example}</span>
                  <button type="button" onClick={newQuestion}>Кийинки суроо</button>
                </div>
              )}
            </div>
          )}

          {activeSection === 'grammar' && (
            <div className={styles.grammarCard}>
              <span className={styles.kicker}>Грамматика</span>
              <h2>Негизги эрежелер</h2>
              <div className={styles.grammarList}>
                {grammarTopics.map((topic) => (
                  <article key={topic.title}>
                    <h3>{topic.title}</h3>
                    <p>{topic.rule}</p>
                    <span>{topic.example}</span>
                  </article>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'dialogs' && (
            <div className={styles.dialogPanel}>
              <div className={styles.dialogGrid}>
                {dialogs.map((dialog) => (
                  <article key={dialog.title}>
                    <h3>{dialog.title}</h3>
                    {dialog.lines.map(([tr, ky]) => (
                      <button key={tr} type="button" onClick={() => speak(tr)}>
                        <strong>{tr}</strong>
                        <span>{ky}</span>
                      </button>
                    ))}
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default EnglishCourse;
