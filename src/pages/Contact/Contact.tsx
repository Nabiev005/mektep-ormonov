import React, { useState } from 'react';
import styles from './Contact.module.css';
import { Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');

    // Директордун номери (боштуксуз жана + белгиси жок)
    const phoneNumber = "996770125632"; 

    // WhatsApp билдирүүсүн кооздоп даярдоо
    const text = `🚀 *Жаңы билдирүү!*\n\n*Аты:* ${name}\n*Email:* ${email || 'Көрсөтүлгөн жок'}\n*Суроо:* ${message}`;

    try {
      await addDoc(collection(db, 'feedback'), {
        title: name.trim(),
        email: email.trim() || 'Email көрсөтүлгөн жок',
        description: message.trim(),
        date: new Date().toLocaleDateString('ky-KG'),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');

      setName('');
      setEmail('');
      setMessage('');
      setStatus('Кайрылуу админ панелге сакталды жана WhatsAppта ачылды.');
    } catch {
      setStatus('Кайрылууну базага сактоодо ката кетти. WhatsApp аркылуу жөнөтүп көрүңүз.');
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <span className={styles.eyebrow}><MessageCircle size={18} /> Байланыш борбору</span>
          <h1>Биз менен байланышыңыз</h1>
          <p>
            Мектеп боюнча суроо, сунуш же кайрылуу болсо, төмөнкү форма аркылуу WhatsAppка
            түз билдирүү жөнөтө аласыз.
          </p>
        </motion.div>

        <motion.div
          className={styles.heroCard}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <ShieldCheck size={28} />
          <strong>Ыкчам жооп</strong>
          <span>Кайрылууңуз мектеп администрациясына WhatsApp аркылуу жөнөтүлөт.</span>
        </motion.div>
      </section>

      <div className={styles.content}>
        <motion.div
          className={styles.info}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <div className={styles.infoCard}>
            <div className={styles.infoHead}>
              <h2>Мектеп маалыматтары</h2>
              <p>Дарек, телефон жана электрондук почта.</p>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.icon}><MapPin size={22} /></span>
              <p><strong>Дарегибиз</strong> Баткен району, Алтын-Бешик аймагы, Кан айылы.</p>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.icon}><Phone size={22} /></span>
              <p><strong>Телефон</strong> <a href="tel:+996770125632">+996 770 125 632</a></p>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.icon}><Mail size={22} /></span>
              <p><strong>Email</strong> <a href="mailto:mektep@gmail.com">mektep@gmail.com</a></p>
            </div>
          </div>

          <div className={styles.quickGrid}>
            <a href="tel:+996770125632" className={styles.quickCard}>
              <Phone size={20} />
              <span>Чалуу</span>
            </a>
            <a href="mailto:mektep@gmail.com" className={styles.quickCard}>
              <Mail size={20} />
              <span>Email</span>
            </a>
            <a href="https://wa.me/996770125632" target="_blank" rel="noreferrer" className={styles.quickCard}>
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </a>
          </div>
          
          <div className={styles.map}>
             <iframe 
                title="Зайил Ормонов атындагы орто мектеби картада"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3067.139193376266!2d71.01718407469369!3d39.758983095411445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ba29d9138663c3%3A0x1ad8817dac18c737!2z0JrQsNC9IDI1INCc0LXQutGC0LXQsdC4!5e0!3m2!1sru!2skg!4v1767364636824!5m2!1sru!2skg" 
                width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy">
             </iframe>
          </div>
        </motion.div>

        <motion.form
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <div className={styles.formHeader}>
            <h3>Түз байланышуу</h3>
            <p>Атыңызды жана сурооңузду жазыңыз, билдирүү WhatsAppта даяр болуп ачылат.</p>
          </div>
          <label className={styles.field}>
            <span><UserRound size={18} /> Атыңыз</span>
            <input
              type="text"
              placeholder="Мисалы: Айдана"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className={styles.field}>
            <span><Mail size={18} /> Email</span>
            <input
              type="email"
              placeholder="Мисалы: name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            <span><MessageCircle size={18} /> Кайрылууңуз</span>
            <textarea
              placeholder="Сурооңузду же сунушуңузду жазыңыз..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </label>
          {status && <p className={styles.formStatus}>{status}</p>}
          <button type="submit" className={styles.whatsappBtn}>
             <Send size={20} /> WhatsApp аркылуу жөнөтүү
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
