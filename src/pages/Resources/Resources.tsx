import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Filter, GraduationCap, Link2, Search, Sparkles, Users } from 'lucide-react';
import styles from './Resources.module.css';

const resourceData = [
  {
    id: "students",
    category: "Окуучулар үчүн",
    icon: BookOpen,
    links: [
      { title: "Khan Academy (Кыргызча)", url: "https://ky.khanacademy.org", desc: "Математика жана табигый илимдер боюнча акысыз сабактар." },
      { title: "Электрондук китепкана", url: "https://kitep.edu.kg/", desc: "Мектеп программасындагы китептери" }
    ]
  },
  {
    id: "teachers",
    category: "Мугалимдер үчүн",
    icon: Users,
    links: [
      { title: "Мугалимдин методикасы", url: "https://bb.edu.gov.kg/docs/Predmet/KG_%D0%9C%D0%B5%D1%82%D0%BE%D0%B4%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%BE%D0%B5%20%D0%BF%D0%BE%D1%81%D0%BE%D0%B1%D0%B8%D0%B5%20%D0%91%D0%B8%D0%BB%D0%B8%D0%BC%20%D0%91%D1%83%D0%BB%D0%B0%D0%B3%D1%8B_CRV.pdf", desc: "Сабак өтүүнүн заманбап ыкмалары жана пландоо үлгүлөрү." },
      { title: "Санариптик куралдар", url: "https://finsabat.kg/ky/education/education-others/216", desc: "Kahoot, Quizizz сыяктуу интерактивдүү оюндарды колдонуу." }
    ]
  },
  {
    id: "exam",
    category: "Экзаменге даярдык",
    icon: GraduationCap,
    links: [
      { title: "ЖРТ (ОРТ) тесттери", url: "https://testing.kg/tests", desc: "Жалпы республикалык тестирлөөгө даярдануу үчүн онлайн ресурстар." },
      { title: "Олимпиада тапшырмалары", url: "https://testing.kg/news/zadaniya-rajonnoj-olimpiadyi-i-ih-resheniya-ii-etap-2024-2025675", desc: "Өткөн жылдардагы олимпиадалык суроолор жана жооптор." }
    ]
  }
];

const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const totalLinks = resourceData.reduce((sum, group) => sum + group.links.length, 0);

  const filteredGroups = useMemo(() => {
    return resourceData
      .filter((group) => activeCategory === 'all' || group.id === activeCategory)
      .map((group) => ({
        ...group,
        links: group.links.filter((link) => {
          const search = `${link.title} ${link.desc} ${group.category}`.toLowerCase();
          return search.includes(searchTerm.toLowerCase());
        }),
      }))
      .filter((group) => group.links.length > 0);
  }, [activeCategory, searchTerm]);

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>
            <Link2 size={18} />
            Санариптик китепче
          </span>
          <h1>Пайдалуу ресурстар</h1>
          <p>Окуучуларга, мугалимдерге жана экзаменге даярдануучуларга керектүү ишенимдүү шилтемелер.</p>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <Sparkles size={23} />
            <strong>{totalLinks}</strong>
            <span>шилтеме</span>
          </div>
          <div className={styles.statCard}>
            <Filter size={23} />
            <strong>{resourceData.length}</strong>
            <span>категория</span>
          </div>
        </div>
      </motion.div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={19} />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ресурсту аталышы же темасы боюнча издөө..."
          />
        </div>
        <div className={styles.filters}>
          <button className={activeCategory === 'all' ? styles.activeFilter : styles.filterBtn} onClick={() => setActiveCategory('all')} type="button">
            Баары
          </button>
          {resourceData.map((group) => (
            <button
              key={group.id}
              className={activeCategory === group.id ? styles.activeFilter : styles.filterBtn}
              onClick={() => setActiveCategory(group.id)}
              type="button"
            >
              {group.category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredGroups.length > 0 ? filteredGroups.map((group, idx) => {
          const Icon = group.icon;
          return (
          <motion.div 
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={styles.categoryCard}
          >
            <h2 className={styles.categoryTitle}>
              <span><Icon size={22} /></span>
              {group.category}
            </h2>
            <div className={styles.linkList}>
              {group.links.map((link, lIdx) => (
                <a href={link.url} target="_blank" rel="noreferrer" key={lIdx} className={styles.resourceLink}>
                  <div className={styles.linkIcon}><ArrowUpRight size={20} /></div>
                  <div className={styles.linkContent}>
                    <h3>{link.title}</h3>
                    <p>{link.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}) : (
          <div className={styles.noData}>
            <Search size={34} />
            <h3>Ресурс табылган жок</h3>
            <p>Издөө сөзүн же категория фильтрин өзгөртүп көрүңүз.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
