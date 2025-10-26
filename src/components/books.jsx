import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import './Books.css';

// 1. კომპონენტი იღებს searchTerm პროპს App.js-დან
function Books({ searchTerm }) {
  // --- დიაგნოსტიკისთვის დამატებული ხაზი ---
  // ვნახოთ, რა მნიშვნელობა აქვს searchTerm-ს ყოველ ჯერზე, როცა კომპონენტი იხატება
  console.log('Books.jsx კომპონენტმა მიიღო searchTerm:', searchTerm);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect "დამოკიდებული" ხდება searchTerm-ზე
  // ეს ნიშნავს, რომ ყოველ ჯერზე, როცა searchTerm შეიცვლება, ეს კოდი თავიდან გაეშვება
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        // 3. API-ს მისამართს ვაწყობთ დინამიურად
        // თუ searchTerm არსებობს, ვამატებთ ?q=... პარამეტრს
        const apiUrl = searchTerm
          ? `${API_BASE_URL}/books?q=${searchTerm}`
          : `${API_BASE_URL}/books/`;

        console.log(`მოთხოვნის გაგზავნა მისამართზე: ${apiUrl}`); // დიაგნოსტიკისთვის

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('ქსელთან დაკავშირებისას მოხდა შეცდომა');
        }
        const data = await response.json();

        // API-დან დაბრუნებულ მონაცემებს ვინახავთ state-ში
        setBooks(data.data || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm]); // <-- დამოკიდებულების მასივი

  if (loading) return <div className="status-message">იტვირთება წიგნები...</div>;
  if (error) return <div className="status-message error">შეცდომა: {error}</div>;

  return (
    <div className="books-page">
      <h1>{searchTerm ? `ძიების შედეგი: "${searchTerm}"` : "წიგნების კატალოგი"}</h1>
      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
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
          <p className="status-message">წიგნები ვერ მოიძებნა.</p>
        )}
      </div>
    </div>
  );
}

export default Books;

