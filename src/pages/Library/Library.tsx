import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Library.module.css';

interface Book {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

const Library: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // 'library' коллекциясын убакыт боюнча иреттеп алуу
    const q = query(collection(db, 'library'), orderBy('updatedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setBooks(booksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Издөө логикасы
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.heroSection}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
        >
          📚 Мектеп китепканасы
        </motion.h1>
        <p>Билим булагы — китеп. Биздин мектептин санариптик китепканасына кош келиңиз!</p>
        
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Китептин атын же авторун издеңиз..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
      </div>

      {loading ? (
        <div className={styles.loader}>Жүктөлүүдө...</div>
      ) : (
        <motion.div 
          layout
          className={styles.booksGrid}
        >
          <AnimatePresence>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <motion.div 
                  key={book.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={styles.bookCard}
                >
                  <div className={styles.imageWrapper}>
                    <img src={book.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image'} alt={book.title} />
                  </div>
                  <div className={styles.bookInfo}>
                    <h3>{book.title}</h3>
                    <p className={styles.description}>{book.description}</p>
                    <div className={styles.bookFooter}>
                      <span className={styles.date}>📅 {book.date}</span>
                      <button className={styles.readBtn}>Толук окуу</button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className={styles.noResults}>Тилекке каршы, эч нерсе табылган жок 😕</p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Library;