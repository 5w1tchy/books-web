// src/components/Header/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import AuthModal from '../AuthModal/AuthModal';
import { useAuth } from '../../context/useAuth';

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();

  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (isSearchActive) setTimeout(() => searchInputRef.current?.focus(), 0);
  }, [isSearchActive]);

  // Suggestion API
  useEffect(() => {
    if (searchTerm.length < 2) return setSuggestions([]);
    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`https://books-api-7hu5.onrender.com/search/suggest?q=${searchTerm}&limit=10`);
        const data = await res.json();
        setSuggestions(data?.data || []);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSuggestionClick = (item) => {
    setSearchTerm('');
    setSuggestions([]);
    setIsSearchActive(false);
    navigate(item.url);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (onSearch) onSearch(searchTerm);
      setSearchTerm('');
      setSuggestions([]);
      setIsSearchActive(false);
      navigate('/books');
    }
  };

  const handleBlur = () => setTimeout(() => setIsSearchActive(false), 150);
  const handleModalClose = () => setModalType(null);
  const handleSwitchModal = (type) => setModalType(type);

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
                <li><Link to="/for-you">შენთვის</Link></li>
                <li><Link to="/contact">კონტაქტი</Link></li>
                <li><Link to="/about">ჩვენს შესახებ</Link></li>
                {user && user.role === 'admin' && (
                  <li><Link to="/admin">⚙️ ადმინისტრირება</Link></li>
                )}
              </ul>
            </li>
          </ul>
        </nav>

        <div className={`header-search ${isSearchActive ? 'active' : ''}`}>
          <button
            className="search-icon-button"
            onClick={() => setIsSearchActive(true)}
          >🔍</button>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="ძიება..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
          {isLoading && <div className="loading-spinner"></div>}
          {isSearchActive && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map(item => (
                <li key={item.slug} onMouseDown={() => handleSuggestionClick(item)}>
                  <span>{item.title || item.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="auth-buttons">
          {!loading && (
            user ? (
              <>
                <span className="welcome-message">გამარჯობა, {user.username}!</span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="auth-btn admin-btn">⚙️ ადმინი</Link>
                )}
                <button onClick={logout} className="auth-btn logout-btn">გასვლა</button>
              </>
            ) : (
              <>
                <button onClick={() => setModalType('login')} className="auth-btn login-btn">ავტორიზაცია</button>
                <button onClick={() => setModalType('register')} className="auth-btn register-btn">რეგისტრაცია</button>
              </>
            )
          )}
        </div>
      </header>

      {modalType && (
        <AuthModal
          type={modalType}
          onClose={handleModalClose}
          onSwitch={handleSwitchModal}
        />
      )}
    </>
  );
};

export default Header;
