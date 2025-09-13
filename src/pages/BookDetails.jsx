import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetails.css'; // დაგვჭირდება სტილების ფაილი

// ეს ფუნქცია ინახავს წიგნის slug-ს localStorage-ში
const saveToRecentlyViewed = (book) => {
  if (!book || !book.slug) return;

  // 1. ვიღებთ არსებულ სიას localStorage-დან
  const recentlyViewedRaw = localStorage.getItem('recentlyViewed');
  let recentlyViewed = recentlyViewedRaw ? JSON.parse(recentlyViewedRaw) : [];

  // 2. ვშლით ამ წიგნს სიიდან, თუ უკვე არსებობს (რომ თავში გადმოვიტანოთ)
  recentlyViewed = recentlyViewed.filter(item => item.slug !== book.slug);

  // 3. ვამატებთ ახალ წიგნს სიის დასაწყისში
  recentlyViewed.unshift(book);

  // 4. ვზღუდავთ სიის ზომას, მაგალითად, ბოლო 10 წიგნით
  if (recentlyViewed.length > 10) {
    recentlyViewed = recentlyViewed.slice(0, 10);
  }

  // 5. ვინახავთ განახლებულ სიას localStorage-ში
  localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
};


function BookDetails() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://books-api-7hu5.onrender.com/books/${slug}`);
        if (!response.ok) {
          throw new Error('წიგნის დეტალების ჩატვირთვისას მოხდა შეცდომა');
        }
        const data = await response.json();
        setBook(data.data);

        // --- მთავარი ლოგიკა ---
        // წიგნის დეტალების წარმატებით ჩატვირთვის შემდეგ, ვინახავთ მას
        saveToRecentlyViewed(data.data);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [slug]);

  if (loading) return <div className="status-message">იტვირთება...</div>;
  if (error) return <div className="status-message error">{error}</div>;
  if (!book) return <div className="status-message">წიგნი ვერ მოიძებნა.</div>;

  return (
    <div className="book-details-page">
      <div className="book-details-container">
        <img src={book.imageUrl || 'https://placehold.co/400x600/eee/ccc?text=No%20Image'} alt={book.title} className="book-cover" />
        <div className="book-content">
          <h1>{book.title}</h1>
          <h2>{book.author}</h2>
          <p className="book-description">{book.description || "აღწერა არ მოიძებნა."}</p>
          {/* აქ შეიძლება დაემატოს სხვა დეტალები: კატეგორია, გამოცემის წელი და ა.შ. */}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;

