import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import './ForYou.css';

// ეს კომპონენტი ხატავს წიგნების ბადეს
const BookGrid = ({ title, books }) => {
    if (!books || books.length === 0) {
        return null; // თუ წიგნები არ არის, არაფერს ვხატავთ
    }

    return (
        <section className="for-you-section">
            <h2>{title}</h2>
            <div className="books-grid">
                {books.map((book) => (
                    <Link to={`/books/${book.slug}`} key={book.id || book.slug} className="book-card-link">
                        <div className="book-card">
                            <img src={book.imageUrl || 'https://placehold.co/300x450/eee/ccc?text=No%20Image'} alt={book.title} />
                            <div className="book-info">
                                <h3>{book.title}</h3>
                                <p>{book.author}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

function ForYou() {
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [similarBooks, setSimilarBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // 1. localStorage-დან ვიღებთ ბოლოს ნანახი წიგნების სიას
                const recentlyViewedRaw = localStorage.getItem('recentlyViewed');
                const viewedBooks = recentlyViewedRaw ? JSON.parse(recentlyViewedRaw) : [];
                setRecentlyViewed(viewedBooks);

                // 2. თუ ნანახი წიგნები არსებობს, ვეძებთ მსგავსებს
                if (viewedBooks.length > 0) {
                    // ვიყენებთ optional chaining-ს (?.) იმისთვის, რომ კოდი არ "ავარდეს" თუ slug არ არსებობს
                    const lastViewedSlug = viewedBooks[0]?.slug;

                    // --- დიაგნოსტიკა და დაცვა ---
                    console.log("ბოლო ნანახი წიგნის slug:", lastViewedSlug);

                    // ვაგზავნით მოთხოვნას მხოლოდ იმ შემთხვევაში, თუ slug არსებობს
                    if (lastViewedSlug) {
                        const response = await fetch(`${API_BASE_URL}/books/${lastViewedSlug}/similar`);

                        if (!response.ok) {
                            throw new Error(`API-სგან დაბრუნდა შეცდომა: ${response.status} ${response.statusText}`);
                        }

                        const data = await response.json();
                        setSimilarBooks(data.data || []);
                    }
                }
            } catch (err) {
                console.error("რეკომენდაციების ჩატვირთვისას დაფიქსირდა დეტალური შეცდომა:", err);
                setError(`შეცდომა: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) return <div className="status-message">რეკომენდაციები იტვირთება...</div>;

    return (
        <div className="for-you-page">
            <h1>შენთვის</h1>

            {error && <div className="status-message error">{error}</div>}

            {recentlyViewed.length === 0 && similarBooks.length === 0 && !loading && !error && (
                <div className="no-history">
                    <p>თქვენ ჯერ არცერთი წიგნი არ გინახავთ.</p>
                    <p>დაიწყეთ კითხვა, რომ მიიღოთ პერსონალური რეკომენდაციები!</p>
                    <Link to="/books" className="browse-books-btn">წიგნების დათვალიერება</Link>
                </div>
            )}

            <BookGrid title="ბოლოს ნანახი" books={recentlyViewed} />
            <BookGrid title="მსგავსი წიგნები" books={similarBooks} />
        </div>
    );
}

export default ForYou;

