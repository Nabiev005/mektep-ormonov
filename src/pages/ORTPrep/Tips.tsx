import React from 'react';
import { useNavigate } from 'react-router-dom';
import { tipsData } from './data/tipsData';

const Tips: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', cursor: 'pointer', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
        ← Артка
      </button>
      
      <h2 style={{ textAlign: 'center', color: '#2d3748', marginBottom: '30px' }}>
        ЖРТны ийгиликтүү тапшыруу үчүн кеңештер 💡
      </h2>

      <div style={{ display: 'grid', gap: '20px' }}>
        {tipsData.map((tip) => (
          <div key={tip.id} style={{ 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '15px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            borderLeft: '6px solid #4299e1'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ background: '#ebf8ff', color: '#2b6cb0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                {tip.category}
              </span>
              <span style={{ fontSize: '24px' }}>{tip.icon}</span>
            </div>
            <h3 style={{ margin: '0 0 10px 0', color: '#1a202c' }}>{tip.title}</h3>
            <p style={{ margin: 0, color: '#4a5568', lineHeight: '1.6' }}>{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tips;