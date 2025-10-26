// src/pages/BookDetails.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthModal from "../components/AuthModal/AuthModal";
import { API_BASE_URL } from "../config/api";
import "./BookDetails.css";
import Coda from "./Coda";

function BookDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

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
        `${API_BASE_URL}/books/${slug}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📖 Book fetch status:", res.status);

      if (res.status === 401 || res.status === 403) {
        const errorText = await res.text();
        console.error("🚫 Auth error:", errorText);
        localStorage.clear();
        setNeedsAuth(true);
        setError("სესია დასრულებულია, გთხოვთ ავტორიზაცია გაიაროთ.");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error(`შეცდომა: ${res.statusText}`);

      const data = await res.json();
      const bookData = data.data || data;

      console.log("📚 Book data received:", bookData);
      console.log("🖼️ Cover URL from DB:", bookData.cover_url);

      // Get cover URL by constructing the endpoint - browser will handle redirect
      let coverImageUrl = "https://placehold.co/300x450/eee/ccc?text=No%20Image";
      if (bookData.cover_url) {
        // Just use the redirect URL directly - no fetch needed
        coverImageUrl = `${API_BASE_URL}/books/${slug}/cover`;
        console.log("🖼️ Using cover URL:", coverImageUrl);
      } else {
        console.log("⚠️ No cover_url in book data");
      }

      setBook({
        title: bookData.title || "უცნობი სათაური",
        author: Array.isArray(bookData.author)
          ? bookData.author.join(", ")
          : Array.isArray(bookData.authors)
            ? bookData.authors.join(", ")
            : bookData.author || bookData.authors || "უცნობი ავტორი",
        categories: bookData.category_slugs || bookData.categories || [],
        short: bookData.short || bookData.description || "",
        summary: bookData.summary || bookData.full_description || "",
        coda: bookData.coda || bookData.best_quote || bookData.excerpt || "",
        imageUrl: coverImageUrl,
        hasAudio: !!bookData.audio_key,
      });

      console.log("🎵 Has audio?", !!bookData.audio_key, "Audio key:", bookData.audio_key);
    } catch (err) {
      setError(err.message || "დაფიქსირდა შეცდომა მონაცემების მიღებისას.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [slug]);

  const fetchAudioUrl = async () => {
    if (!book?.hasAudio) return;

    setAudioLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/books/${slug}/audio`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setAudioUrl(data.audio_url);
      }
    } catch (err) {
      console.error("Failed to fetch audio URL:", err);
    } finally {
      setAudioLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (audioUrl) {
      // If we already have the URL, just play
      const audio = document.getElementById('book-audio');
      if (audio) audio.play();
    } else {
      // Fetch the URL first
      fetchAudioUrl();
    }
  };

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
        <div>
          <img
            src={book.imageUrl}
            alt={book.title}
            className="book-detail-cover"
          />

          {/* Audio player right below the cover */}
          {book.hasAudio && (
            <div className="audio-player-section" style={{ marginTop: '15px' }}>
              {audioUrl ? (
                <audio id="book-audio" controls style={{ width: '100%' }}>
                  <source src={audioUrl} type="audio/mpeg" />
                  თქვენი ბრაუზერი არ უჭერს მხარს აუდიო ელემენტს.
                </audio>
              ) : (
                <button
                  className="play-audio-btn"
                  onClick={handlePlayAudio}
                  disabled={audioLoading}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: audioLoading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  {audioLoading ? '⏳ იტვირთება...' : '▶️ მოუსმინე წიგნს'}
                </button>
              )}
            </div>
          )}
        </div>

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
