import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserManagement from '../components/Admin/UserManagement';
import BookManagement from '../components/Admin/BookManagement';
import AdminStats from '../components/Admin/AdminStats';
import './Admin.css';

const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ავტორიზაციის შემოწმება
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      navigate('/');
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'users':
        return <UserManagement />;
      case 'books':
        return <BookManagement />;
      case 'stats':
        return <AdminStats />;
      default:
        return (
          <div className="admin-dashboard">
            <h2>დაშბორდი</h2>
            <div className="dashboard-grid">
              <div className="dashboard-card" onClick={() => setActiveSection('users')}>
                <h3>👥 მომხმარებლები</h3>
                <p>მომხმარებლების სიის ნახვა და მართვა</p>
                <button className="admin-button">მართვა</button>
              </div>
              
              <div className="dashboard-card" onClick={() => setActiveSection('books')}>
                <h3>📚 წიგნები</h3>
                <p>ახალი წიგნის დამატება ან არსებულის რედაქტირება</p>
                <button className="admin-button">მართვა</button>
              </div>
              
              <div className="dashboard-card" onClick={() => setActiveSection('stats')}>
                <h3>📊 ანალიტიკა</h3>
                <p>საიტის სტატისტიკის ნახვა</p>
                <button className="admin-button">ნახვა</button>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!user) {
    return <div className="admin-loading">იტვირთება...</div>;
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>ადმინის პანელი</h1>
          <nav className="admin-nav">
            <button 
              className={activeSection === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveSection('dashboard')}
            >
              მთავარი
            </button>
            <button 
              className={activeSection === 'users' ? 'active' : ''}
              onClick={() => setActiveSection('users')}
            >
              მომხმარებლები
            </button>
            <button 
              className={activeSection === 'books' ? 'active' : ''}
              onClick={() => setActiveSection('books')}
            >
              წიგნები
            </button>
            <button 
              className={activeSection === 'stats' ? 'active' : ''}
              onClick={() => setActiveSection('stats')}
            >
              სტატისტიკა
            </button>
          </nav>
          <div className="admin-user-info">
            <span>მოგესალმებით, {user.username || user.email}</span>
            <button onClick={handleLogout} className="logout-btn">გასვლა</button>
          </div>
        </div>
      </header>

      <main className="admin-content">
        {renderSection()}
      </main>
    </div>
  );
};

export default Admin;