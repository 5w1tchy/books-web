import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import real components
import AdminStats from '../components/Admin/AdminStats';
import UserManagement from '../components/Admin/UserManagement';
import BookManagement from '../components/Admin/BookManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // მომხმარებლის შემოწმება localStorage-დან
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔐 AdminDashboard - Checking auth:', { token: !!token, userData: !!userData });
    
    if (!token || !userData) {
      console.log('❌ No auth data found, redirecting to login');
      navigate('/admin/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log('👤 Parsed user:', parsedUser);
      
      if (parsedUser.role !== 'admin') {
        alert('თქვენ არ ხართ ადმინისტრატორი');
        navigate('/');
        return;
      }
      
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/admin/login');
      return;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f8f9fa'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          ადმინის პანელი იტვირთება...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px 0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>
              ⚙️ ადმინის პანელი
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
              წიგნების პლატფორმის მართვის სისტემა
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>მოგესალმებით,</div>
              <div style={{ fontSize: '18px', fontWeight: '600' }}>
                {user.username || user.email}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🏠 მთავარ გვერდზე
              </button>
              
              <button
                onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(220, 53, 69, 0.8)',
                  color: 'white',
                  border: '1px solid rgba(220, 53, 69, 0.6)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🚪 გასვლა
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{
        background: 'white',
        borderBottom: '2px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <nav style={{ display: 'flex', gap: '0' }}>
            {[
              { key: 'stats', label: 'სტატისტიკა', icon: '📊' },
              { key: 'books', label: 'წიგნები', icon: '📚' },
              { key: 'users', label: 'მომხმარებლები', icon: '👥' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  console.log('🔄 Switching to tab:', tab.key);
                  setActiveTab(tab.key);
                }}
                style={{
                  padding: '20px 30px',
                  background: activeTab === tab.key ? '#007bff' : 'transparent',
                  color: activeTab === tab.key ? 'white' : '#495057',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: activeTab === tab.key ? '600' : '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          minHeight: '70vh'
        }}>
          {/* Show current active tab for debugging */}
          <div style={{
            background: '#e3f2fd',
            padding: '10px 20px',
            color: '#1565c0',
            fontSize: '14px',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}>
            🔍 Debug: Active Tab = "{activeTab}"
          </div>

          {activeTab === 'stats' && <AdminStats />}
          {activeTab === 'books' && <BookManagement />}
          {activeTab === 'users' && <UserManagement />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;