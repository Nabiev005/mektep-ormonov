import { useNavigate } from 'react-router-dom';

const Methodology = () => {
  const navigate = useNavigate();

  const strategies = [
    {
      title: "Убакытты үнөмдөө",
      desc: "Ар бир бөлүм үчүн таймерди туура колдонуу. Математикага 90 сек, аналогияга 30 сек.",
      tip: "Эгер суроо 1 мүнөттө чечилбесе, аны белгилеп кийинкисине өтүңүз!",
      icon: "⏱️"
    },
    {
      title: "Чыгарып салуу ыкмасы",
      desc: "Төрт варианттын ичинен ачык эле туура эмес 2 жоопту таап, чийип салыңыз.",
      tip: "Бул туура жоопту табуу мүмкүнчүлүгүн 25%дан 50%га чейин жогорулатат.",
      icon: "❌"
    },
    {
      title: "Жооп баракчасы",
      desc: "Тегерекчелерди боёодо адашпоо үчүн ар бир 5 суроодон кийин текшерип туруңуз.",
      tip: "Жоопту дароо баракчага боёңуз, аягына калтырбаңыз!",
      icon: "📝"
    },
    {
      title: "Текст менен иштөө",
      desc: "Текстти окуудан мурун анын суроолорун тез карап чыгыңыз.",
      tip: "Бул сизге тексттин ичинен керектүү маалыматты бат табууга жардам берет.",
      icon: "📖"
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px', border: 'none', background: 'none', cursor: 'pointer', color: '#4a5568' }}
      >
        ← Артка кайтуу
      </button>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2d3748' }}>ЖРТ Тапшыруу Методикасы</h1>
        <p style={{ color: '#718096' }}>Жогорку упай алуу үчүн маанилүү стратегиялар</p>
      </div>

      {/* Жалпы маалымат блогу */}
      <div style={{ 
        backgroundColor: '#ebf8ff', 
        padding: '25px', 
        borderRadius: '15px', 
        borderLeft: '5px solid #3182ce',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#2b6cb0' }}>💡 Алтын эреже:</h3>
        <p style={{ margin: 0, color: '#2c5282', lineHeight: '1.6' }}>
          ЖРТ — бул сиздин канчалык акылдуу экениңизди гана эмес, чектелген убакытта канчалык 
          эффективдүү иштей аларыңызды текшерет. Ар бир секунд маанилүү!
        </p>
      </div>

      {/* Стратегиялар сеткасы */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {strategies.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '15px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            alignItems: 'flex-start'
          }}>
            <div style={{ fontSize: '30px', marginRight: '20px' }}>{item.icon}</div>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>{item.title}</h4>
              <p style={{ margin: '0 0 10px 0', color: '#4a5568', fontSize: '15px' }}>{item.desc}</p>
              <div style={{ fontSize: '13px', color: '#38a169', fontWeight: 'bold' }}>
                Кеңеш: {item.tip}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Упай эсептөө схемасы */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h3 style={{ color: '#2d3748' }}>ЖРТ Тесттин Түзүмү</h3>
        
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#edf2f7' }}>
                <th style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Бөлүм</th>
                <th style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Суроо саны</th>
                <th style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Убакыт</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Математика</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>60</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>90 мүнөт</td>
              </tr>
              <tr>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>Окуу жана түшүнүү</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>30</td>
                <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>60 мүнөт</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Methodology;