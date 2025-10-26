import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import './Books.css';

// თუ ძებნის ფუნქციონალიც გაქვს, searchTerm დააბრუნე props-ში: function Books({ searchTerm })
function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. ვამატებთ ახალ state-ს სორტირების პარამეტრის შესანახად
  const [sortBy, setSortBy] = useState('newest'); // თავდაპირველად უახლესით ვასორტირებთ

  // 2. useEffect ახლა დამოკიდებული ხდება sortBy ცვლადზეც
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true); // ყოველი ახალი მოთხოვნისას ვაჩვენებთ ჩატვირთვის ინდიკატორს
      setError(null);
      try {
        // 3. API მისამართს ვაწყობთ დინამიურად sortBy პარამეტრის გამოყენებით
        const apiUrl = `${API_BASE_URL}/books?sort=${sortBy}`;

        // თუ ძებნაც გჭირდება, ლოგიკა ასეთი იქნება:
        // const searchParam = searchTerm ? `&q=${searchTerm}` : '';
        // const apiUrl = `${API_BASE_URL}/books?sort=${sortBy}${searchParam}`;

        console.log("API მოთხოვნა მისამართზე:", apiUrl); // დიაგნოსტიკისთვის

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBooks(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [sortBy]); // <-- 4. დამოკიდებულების მასივში ვამატებთ sortBy-ს

  // 5. ფუნქცია, რომელიც ცვლის სორტირების state-ს
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  if (error) return <div className="status-message error">შეცდომა: {error}</div>;

  return (
    <div className="books-page">
      <div className="page-header">
        <h1>წიგნების კატალოგი</h1>

        {/* --- ⭐ 6. ვამატებთ ფილტრის UI ელემენტს --- */}
        <div className="filters-container">
          <label htmlFor="sort-by">სორტირება:</label>
          <select id="sort-by" value={sortBy} onChange={handleSortChange}>
            <option value="newest">უახლესი</option>
            <option value="popularity">პოპულარული</option>
            <option value="title_asc">სათაური (ა-ჰ)</option>
            <option value="title_desc">სათაური (ჰ-ა)</option>
          </select>
        </div>
      </div>

      {/* --- ⭐ 7. ვამატებთ loading მდგომარეობას აქაც --- */}
      {loading ? (
        <div className="status-message">იტვირთება წიგნები...</div>
      ) : (
        <div className="books-grid">
          {books.length > 0 ? (
            books.map((book) => {
              const coverUrl = book.imageUrl
                ? `${API_BASE_URL}${book.imageUrl}`
                : 'https://placehold.co/300x450/eee/ccc?text=No%20Image';

              return (
                <Link to={`/books/${book.slug || book.id}`} key={book.id} className="book-card-link">
                  <div className="book-card">
                    <img src={coverUrl} alt={book.title} />
                    <div className="book-info">
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                      {book.summary && (
                        <p className="book-card-summary">
                          {book.summary.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="status-message">წიგნები ვერ მოიძებნა.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Books;