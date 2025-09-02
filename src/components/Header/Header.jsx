import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import AuthModal from '../AuthModal/AuthModal'; // იმპორტი ახალი კომპონენტის

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchInputRef = useRef(null);
  
  // State, რომელიც განსაზღვრავს რომელი მოდალია ღია: 'login', 'register' ან null
  const [modalType, setModalType] = useState(null);

  // ეფექტი, რომელიც ფოკუსს გადაიტანს საძიებო ველზე მისი გააქტიურებისას
  useEffect(() => {
    if (isSearchActive) {
      setTimeout(() => searchInputRef.current.focus(), 0);
    }
  }, [isSearchActive]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    // აქ შეგიძლიათ დაამატოთ ძიების ლოგიკა
  };

  return (
    <>
      <header className="main-header">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src="/images/Logo.png" alt="Logo" className="logo-image" />
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="main-nav">
          <ul>
            <li className="dropdown">
              <button className="nav-button">მენიუ</button>
              <ul className="dropdown-menu">
                <li><Link to="/books">წიგნები</Link></li>
                <li><Link to="/about">ჩვენს შესახებ</Link></li>
                <li><a href="#soon1">მალე 1</a></li>
                <li><a href="#soon2">მალე 2</a></li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* მარჯვენა ნაწილი: ძიება და ავტორიზაცია */}
        <div className="header-actions">
          {/* Search input with toggle logic */}
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
              onBlur={() => setIsSearchActive(false)} // ველი დაიმალება, როდესაც ფოკუსს დაკარგავს
            />
          </div>

          {/* Authorization Buttons */}
          <div className="auth-buttons">
            <button onClick={() => setModalType('login')} className="auth-btn login-btn">ავტორიზაცია</button>
            <button onClick={() => setModalType('register')} className="auth-btn register-btn">რეგისტრაცია</button>
          </div>
        </div>
      </header>

      {/* მოდალის გამოჩენა, თუ modalType არ არის null */}
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

