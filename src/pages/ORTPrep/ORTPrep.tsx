import { useNavigate } from 'react-router-dom';

const ORTPrep = () => {
  const navigate = useNavigate();

  // Предметтердин маалыматтары жана прогресси
  const subjects = [
    { 
      id: 'math', 
      title: 'Математика', 
      desc: 'Сандарды салыштыруу, логикалык эсептер жана геометрия.',
      icon: '📐', 
      color: '#4299e1',
      progress: 45 
    },
    { 
      id: 'analogies', 
      title: 'Аналогиялар', 
      desc: 'Сөздөрдүн ортосундагы логикалык байланышты табуу.',
      icon: '🧠', 
      color: '#48bb78',
      progress: 30
    },
    { 
      id: 'reading', 
      title: 'Окуу жана түшүнүү', 
      desc: 'Текстти талдоо жана негизги максатын аныктоо.',
      icon: '📖', 
      color: '#ed8936',
      progress: 15
    },
    { 
      id: 'grammar', 
      title: 'Кыргыз тили', 
      desc: 'Грамматика, пунктуация жана лексика эрежелери.',
      icon: '✍️', 
      color: '#9f7aea',
      progress: 60
    },
    { 
      id: 'tips', 
      title: 'ЖРТ Лайфхактар', 
      desc: 'Тестти оңой иштөө ыкмалары жана убакытты үнөмдөө сырлары.',
      icon: '💡', 
      color: '#ecc94b',
      progress: 100
    },
    { 
      id: 'methodology', 
      title: 'ЖРТ Методикасы', 
      desc: 'Тестти иштөө тактикасы, убакытты үнөмдөө жана упай эсептөө сырлары.',
      icon: '🎓', 
      color: '#2d3748', 
      progress: 0 
   }
  ];

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      
      {/* 1. КҮНДҮН СӨЗҮ БЛОГУ */}
      <div style={{ 
        background: 'linear-gradient(135deg, #4c51bf 0%, #6b46c1 100%)', 
        color: 'white', 
        padding: '35px 25px', 
        borderRadius: '24px', 
        marginBottom: '40px',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(76, 81, 191, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '5px 15px', 
            borderRadius: '20px', 
            fontSize: '13px', 
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            🌟 Күндүн сөзү
          </span>
          <h2 style={{ margin: '15px 0 10px 0', fontSize: '36px', letterSpacing: '2px' }}>КАЙРАТ</h2>
          <p style={{ margin: '0 auto', fontSize: '17px', maxWidth: '600px', lineHeight: '1.6', opacity: 0.9 }}>
            "Кыйынчылыктарга багынбаган эрктүүлүк, чыдамкайлык жана чечкиндүүлүк."
          </p>
        </div>
        {/* Декоративдик иконка фонунда */}
        <div style={{ 
          position: 'absolute', 
          right: '-10px', 
          bottom: '-10px', 
          fontSize: '120px', 
          opacity: 0.1,
          transform: 'rotate(-15deg)' 
        }}>📚</div>
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#1a202c', fontWeight: '800' }}>
        ЖРТ Даярдык Борбору
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '40px', color: '#718096', fontSize: '18px' }}>
        Каалаган бөлүмдү тандап, даярданууну баштаңыз
      </p>

      {/* 2. ПРЕДМЕТТЕРДИН ТИЗМЕСИ (GRID) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '25px',
        paddingBottom: '50px'
      }}>
        {subjects.map((subject) => (
          <div 
            key={subject.id}
            onClick={() => navigate(subject.id === 'tips' ? '/ort-tips' : `/ort/${subject.id}`)}
            style={{
              cursor: 'pointer',
              padding: '30px',
              borderRadius: '24px',
              backgroundColor: '#ffffff',
              border: '1px solid #edf2f7',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.02)',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = subject.color;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.02)';
              e.currentTarget.style.borderColor = '#edf2f7';
            }}
          >
            {/* Иконка жана Титул */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ 
                fontSize: '35px', 
                backgroundColor: `${subject.color}15`, 
                width: '75px',
                height: '75px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: subject.color,
                marginRight: '20px'
              }}>
                {subject.icon}
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: 0, color: '#1a202c', fontSize: '20px', fontWeight: 'bold' }}>
                  {subject.title}
                </h3>
                <span style={{ fontSize: '13px', color: '#a0aec0' }}>
                  {subject.id === 'tips' ? 'Кошумча' : 'Негизги бөлүм'}
                </span>
              </div>
            </div>

            {/* Түшүндүрмө */}
            <p style={{ 
              color: '#4a5568', 
              fontSize: '15px', 
              lineHeight: '1.6', 
              flexGrow: 1, 
              marginBottom: '25px',
              textAlign: 'left' 
            }}>
              {subject.desc}
            </p>

            {/* ПРОГРЕСС ТИЛКЕСИ */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '12px', 
                marginBottom: '8px', 
                fontWeight: 'bold', 
                color: '#718096' 
              }}>
                <span>Өздөштүрүү</span>
                <span>{subject.progress}%</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                background: '#edf2f7', 
                borderRadius: '10px', 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  width: `${subject.progress}%`, 
                  height: '100%', 
                  background: subject.color, 
                  borderRadius: '10px',
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }}></div>
              </div>
            </div>

            {/* БАСКЫЧ */}
            <button style={{
              padding: '14px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: subject.color,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: `0 8px 15px ${subject.color}33`,
              transition: 'filter 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
            >
              {subject.id === 'tips' ? 'Кеңештерди окуу' : 'Машыгууну баштоо'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ORTPrep;