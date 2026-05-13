import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <span className={styles.code}>404</span>
        <h1>Баракча табылган жок</h1>
        <p>
          Бул дарек туура эмес жазылган же баракча башка бөлүмгө көчүрүлгөн болушу мүмкүн.
          Башкы бетке кайтып, керектүү бөлүмдү менюдан тандаңыз.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primary}>
            <Home size={19} />
            Башкы бет
          </Link>
          <Link to="/resources" className={styles.secondary}>
            <Search size={19} />
            Ресурстар
          </Link>
          <Link to="/about" className={styles.textLink}>
            <ArrowLeft size={18} />
            Биз жөнүндө
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
