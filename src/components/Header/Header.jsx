import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import AuthModal from '../AuthModal/AuthModal';

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchActive) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isSearchActive]);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`https://books-api-7hu5.onrender.com/search/suggest?q=${searchTerm}&limit=10`);
          if (!response.ok) {
            throw new Error('API response was not ok.');
          }
          const data = await response.json();
          if (data.status === 'success' && Array.isArray(data.data)) {
            setSuggestions(data.data);
          } else {
            setSuggestions([]);
          }
        } catch (error) {
          console.error("შემოთავაზებების ჩატვირთვისას მოხდა ერორი:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSuggestionClick = (item) => {
    setSearchTerm('');
    setSuggestions([]);
    setIsSearchActive(false);
    navigate(item.url);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchTerm.length > 0) {
        if (onSearch) {
          onSearch(searchTerm);
        }
        setSearchTerm('');
        setSuggestions([]);
        setIsSearchActive(false);
        navigate('/books');
      }
    }
  };
  
  const handleBlur = () => {
    setTimeout(() => {
      setIsSearchActive(false);
    }, 150); // მცირე დაყოვნება, რომ კლიკმა მოსწროს
  };

  return (
    <>
      <header className="main-header">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src="/images/Logo.png" alt="Logo" className="logo-image" />
          </Link>
        </div>

        <nav className="main-nav">
          <ul>
            <li className="dropdown">
              <button className="nav-button">მენიუ</button>
              <ul className="dropdown-menu">
                <li><Link to="/books">წიგნები</Link></li>
                <li><a href="#soon1">მალე 1</a></li>
                {/* --- დამატებული და გადალაგებული პუნქტები --- */}
                <li><Link to="/for-you">შენთვის</Link></li>
                <li><a href="#soon2">მალე 2</a></li>
                <li><Link to="/about">ჩვენს შესახებ</Link></li>
              </ul>
            </li>
          </ul>
        </nav>

        <div className={`header-search ${isSearchActive ? 'active' : ''}`}>
          <button
            className="search-icon-button"
            onClick={() => setIsSearchActive(true)}
            aria-label="ძიების ველის გახსნა"
          >
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="ძიება..."
            value={searchTerm}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
          {isLoading && <div className="loading-spinner"></div>}
          {isSearchActive && searchTerm.length >= 2 && (
            <ul className="suggestions-list">
              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <li
                    key={item.type === 'book' ? item.id : item.slug}
                    className="suggestion-item"
                    onMouseDown={() => handleSuggestionClick(item)} 
                  >
                    <div className="suggestion-details">
                      <span className="suggestion-title">{item.title || item.name}</span>
                      {item.type === 'book' && <span className="suggestion-author">{item.authorName}</span>}
                    </div>
                  </li>
                ))
              ) : !isLoading && (
                <li className="suggestion-not-found">
                  შედეგი ვერ მოიძებნა
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="auth-buttons">
          <button onClick={() => setModalType('login')} className="auth-btn login-btn">ავტორიზაცია</button>
          <button onClick={() => setModalType('register')} className="auth-btn register-btn">რეგისტრაცია</button>
        </div>
      </header>

      {modalType && (
        <AuthModal
          type={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
};

export default Header;

