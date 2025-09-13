import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Books.css';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('https://books-api-7hu5.onrender.com/books');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // დიაგნოსტიკის ხაზი წაშლილია
        setBooks(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="status-message">იტვირთება წიგნები...</div>;
  if (error) return <div className="status-message error">შეცდომა: {error}</div>;

  return (
    <div className="books-page">
      <h1>წიგნების კატალოგი</h1>
      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            // ეს კოდი ახლა გამართულად იმუშავებს, რადგან slug არსებობს
            <Link to={`/books/${book.slug || book.id}`} key={book.id} className="book-card-link">
              <div className="book-card">
                <img src={book.imageUrl || 'https://placehold.co/300x450/eee/ccc?text=No%20Image'} alt={book.title} />
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>წიგნები ვერ მოიძებნა.</p>
        )}
      </div>
    </div>
  );
}

export default Books;

