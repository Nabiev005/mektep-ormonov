import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'; // Иконкалар
import styles from './Login.module.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin-panel');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Логин же пароль туура эмес! Же тармактан ката кетти.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      {/* Фондогу кооз тегерекчелер (анимация менен) */}
      <div className={styles.circle1}></div>
      <div className={styles.circle2}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.loginCard}
      >
        <div className={styles.loginHeader}>
          <div className={styles.logoIcon}>🎓</div>
          <h2>Мектептин Админ Панели</h2>
          <p>Улантуу үчүн маалыматтарды киргизиңиз</p>
        </div>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.inputBox}>
            <Mail className={styles.icon} size={20} />
            <input 
              type="email" 
              placeholder="Email дарегиңиз" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.inputBox}>
            <Lock className={styles.icon} size={20} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Пароль" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <div 
              className={styles.eyeBtn} 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className={styles.loginBtn}
            disabled={loading}
          >
            {loading ? "Кирүүдө..." : "Кирүү ✨"}
          </motion.button>
        </form>

        <div className={styles.loginFooter}>
          <p>Админ гана кире алат!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;