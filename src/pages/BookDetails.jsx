// src/components/BookDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BookDetails.css';
import Coda from './Coda'; // <-- 1. დააიმპორტე Coda კომპონენტი

function BookDetail() {
  // ... (შენი state-ები და useEffect უცვლელი რჩება) ...
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://books-api-7hu5.onrender.com/books/${slug}`);
        if (!response.ok) {
          throw new Error('წიგნის ჩატვირთვისას მოხდა შეცდომა');
        }
        const data = await response.json();
        setBook(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [slug]); 

  if (loading) return <div className="status-message">იტვირთება წიგნი...</div>;
  if (error) return <div className="status-message error">შეცდომა: {error}</div>;
  if (!book) return <div className="status-message">წიგნი ვერ მოიძებნა.</div>;

  const isLongSummary = book.summary && book.summary.length > 300;
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  

  
  return (
    <div className="book-detail-page">
      <div className="book-detail-container">
        <img 
          src={book.imageUrl || 'https://placehold.co/300x450/eee/ccc?text=No%20Image'} 
          alt={book.title} 
          className="book-detail-cover"
        />
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <h2>{book.author}</h2>
          
          {/* --- ⭐ 2. ჩავსვით Coda კომპონენტი აქ --- */}
          {/* ჩაანაცვლე book.coda იმ სახელით, რომელიც კონსოლში ნახე! */}
          <Coda text={book.coda} />

          {book.summary ? (
            <div className="book-summary-section">
              <h3>აღწერა</h3>
              <p>
                {isLongSummary && !isExpanded
                  ? `${book.summary.substring(0, 300)}...`
                  : book.summary
                }
              </p>
              {isLongSummary && (
                <button onClick={toggleReadMore} className="read-more-btn">
                  {isExpanded ? 'შეკეცვა' : 'სრულად წაკითხვა'}
                </button>
              )}
            </div>
          ) : (
            <p>ამ წიგნს აღწერა არ აქვს.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;