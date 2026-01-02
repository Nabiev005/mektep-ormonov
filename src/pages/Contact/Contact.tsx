import React, { useState } from 'react';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Рахмат, ${name}! Сиздин билдирүүңүз жөнөтүлдү.`);
    setName('');
    setMessage('');
  };

  return (
    <div className={styles.container}>
      <h2>Биз менен байланышыңыз</h2>
      
      <div className={styles.content}>
        {/* Байланыш маалыматтары */}
        <div className={styles.info}>
          <div className={styles.infoItem}>
            <p><strong>Дарегибиз:</strong> Баткен район, Дара аймагы Кан айылы.</p>
          </div>
          <div className={styles.infoItem}>
            <p><strong>Телефон:</strong> +996 702952200</p>
          </div>
          <div className={styles.infoItem}>
            <p><strong>Email:</strong> info@mektep.kg</p>
          </div>
          
          {/* Карта үчүн орун (Placeholder) */}
          <div className={styles.map}>
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.139193376266!2d71.01718407469369!3d39.758983095411445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ba29d9138663c3%3A0x1ad8817dac18c737!2z0JrQsNC9IDI1INCc0LXQutGC0LXQsdC4!5e0!3m2!1sru!2skg!4v1767364636824!5m2!1sru!2skg" 
               width="100%" height="250" style={{ border: 0, borderRadius: '8px' }} allowFullScreen loading="lazy">
             </iframe>
          </div>
        </div>

        {/* Суроо берүү формасы */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Атыңыз" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
          <textarea 
            placeholder="Сиздин сурооңуз..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button type="submit">Жөнөтүү</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;