import React from 'react';
import { motion } from 'framer-motion';
import styles from './Resources.module.css';

const resourceData = [
  {
    category: "📚 Окуучулар үчүн",
    links: [
      { title: "Khan Academy (Кыргызча)", url: "https://ky.khanacademy.org", desc: "Математика жана табигый илимдер боюнча акысыз сабактар." },
      { title: "Электрондук китепкана", url: "https://kitep.edu.kg/", desc: "Мектеп программасындагы китептери" }
    ]
  },
  {
    category: "👨‍🏫 Мугалимдер үчүн",
    links: [
      { title: "Мугалимдин методикасы", url: "https://bb.edu.gov.kg/docs/Predmet/KG_%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D0%BF%D0%BE%D1%81%D0%BE%D0%B1%D0%B8%D0%B5%20%D0%91%D0%B8%D0%BB%D0%B8%D0%BC%20%D0%91%D1%83%D0%BB%D0%B0%D0%B3%D1%8B_CRV.pdf", desc: "Сабак өтүүнүн заманбап ыкмалары жана пландоо үлгүлөрү." },
      { title: "Санариптик куралдар", url: "https://finsabat.kg/ky/education/education-others/216", desc: "Kahoot, Quizizz сыяктуу интерактивдүү оюндарды колдонуу." }
    ]
  },
  {
    category: "🎓 Экзаменге даярдык",
    links: [
      { title: "ЖРТ (ОРТ) тесттери", url: "https://testing.kg/tests", desc: "Жалпы республикалык тестирлөөгө даярдануу үчүн онлайн ресурстар." },
      { title: "Олимпиада тапшырмалары", url: "https://testing.kg/news/zadaniya-rajonnoj-olimpiadyi-i-ih-resheniya-ii-etap-2024-2025675", desc: "Өткөн жылдардагы олимпиадалык суроолор жана жооптор." }
    ]
  }
];

const Resources: React.FC = () => {
  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.header}
      >
        <h1>📚 Пайдалуу Ресурстар</h1>
        <p>Билим алууда жана иштөөдө керектүү болгон санариптик куралдардын жыйнагы</p>
      </motion.div>

      <div className={styles.grid}>
        {resourceData.map((group, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={styles.categoryCard}
          >
            <h2 className={styles.categoryTitle}>{group.category}</h2>
            <div className={styles.linkList}>
              {group.links.map((link, lIdx) => (
                <a href={link.url} target="_blank" rel="noreferrer" key={lIdx} className={styles.resourceLink}>
                  <div className={styles.linkIcon}>🔗</div>
                  <div className={styles.linkContent}>
                    <h3>{link.title}</h3>
                    <p>{link.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Resources;