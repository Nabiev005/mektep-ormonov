import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Admin.module.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin-panel'); // Туура болсо админге өтөт
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Логин же пароль туура эмес!");
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <motion.form 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onSubmit={handleLogin} 
        className={styles.loginForm}
      >
        <h2>Админге кирүү</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Кирүү ✨</button>
      </motion.form>
    </div>
  );
};

export default Login;