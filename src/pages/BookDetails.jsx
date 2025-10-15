// src/pages/BookDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookDetails.css";
import Coda from "./Coda";
import AuthModal from "../components/AuthModal/AuthModal";

function BookDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  const getToken = () =>
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token");

  const fetchBook = async () => {
    setLoading(true);
    setError(null);

    const token = getToken();

    if (!token) {
      setNeedsAuth(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://books-api-7hu5.onrender.com/books/${slug}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        setNeedsAuth(true);
        setError("სესია დასრულებულია, გთხოვთ ავტორიზაცია გაიაროთ.");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error(`შეცდომა: ${res.statusText}`);

      const data = await res.json();
      const bookData = data.data || data;

      setBook({
        title: bookData.title || "უცნობი სათაური",
        author: Array.isArray(bookData.authors)
          ? bookData.authors.join(", ")
          : bookData.author || "უცნობი ავტორი",
        categories: bookData.categories || [],
        short: bookData.short || bookData.description || "",
        summary: bookData.summary || bookData.full_description || "",
        coda: bookData.coda || bookData.best_quote || bookData.excerpt || "",
        imageUrl:
          bookData.imageUrl ||
          "https://placehold.co/300x450/eee/ccc?text=No%20Image",
      });
    } catch (err) {
      setError(err.message || "დაფიქსირდა შეცდომა მონაცემების მიღებისას.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [slug]);

  const handleModalClose = () => setModalType(null);

  const handleAuthSuccess = () => {
    setNeedsAuth(false);
    fetchBook();
    setModalType(null);
  };

  if (loading)
    return <div className="status-message loading">📚 იტვირთება წიგნი...</div>;

  if (needsAuth)
    return (
      <div className="status-message info">
        🚨 ავტორიზაცია აუცილებელია
        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button
            onClick={() => setModalType("login")}
            className="auth-btn login-btn"
          >
            ავტორიზაცია
          </button>
          <button
            onClick={() => setModalType("register")}
            className="auth-btn register-btn"
          >
            რეგისტრაცია
          </button>
          <button
            onClick={() => navigate("/")}
            className="auth-btn home-btn"
          >
            მთავარი გვერდი
          </button>
        </div>

        {modalType && (
          <AuthModal
            type={modalType}
            onClose={handleModalClose}
            onSwitch={(type) => setModalType(type)}
            redirectTo={`/books/${slug}`}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    );

  if (error)
    return (
      <div className="status-message error">
        🚨 შეცდომა: {error}
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => navigate("/")}>მთავარ გვერდზე დაბრუნება</button>
        </div>
      </div>
    );

  if (!book)
    return <div className="status-message">📕 წიგნი ვერ მოიძებნა.</div>;

  const isLong = book.summary && book.summary.length > 300;

  return (
    <div className="book-detail-page">
      <div className="book-detail-container">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="book-detail-cover"
        />
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <h2>{book.author}</h2>

          {book.categories.length > 0 && (
            <div className="book-categories">
              {book.categories.map((cat, i) => (
                <span key={i} className="category-tag">
                  {cat}
                </span>
              ))}
            </div>
          )}

          {book.coda && <Coda text={book.coda} />}

          {book.short && (
            <div className="book-short-section">
              <h3>📝 მოკლე აღწერა</h3>
              <p>{book.short}</p>
            </div>
          )}

          {book.summary && (
            <div className="book-summary-section">
              <h3>📖 სრული აღწერა</h3>
              <p>
                {isLong && !isExpanded
                  ? `${book.summary.substring(0, 300)}...`
                  : book.summary}
              </p>
              {isLong && (
                <button
                  className="expand-btn"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "🔼 შეკეცვა" : "🔽 სრულად წაკითხვა"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
