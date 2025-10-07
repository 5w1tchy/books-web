import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // შემოწმება - თუ უკვე ავტორიზებულია, გადავიყვანოთ ადმინის პანელში
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === 'admin') {
          navigate('/admin');
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // პირველ რიგში ვცდილობთ მთავარ endpoint-ს
      const response = await fetch('https://books-api-7hu5.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login success:', data);
        
        // თუ მივიღეთ tokens, შევინახოთ და შევქმნათ admin user object
        if (data.access_token) {
          const adminUser = {
            id: 'admin-001',
            email: credentials.email,
            username: 'admin',
            role: 'admin'
          };
          
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('user', JSON.stringify(adminUser));
          
          // გადასვლა admin panel-ში
          window.location.href = '/admin';
          return;
        }
      }
      
      // თუ API არ იმუშავა ან არ არის admin - demo mode
      if (credentials.email.toLowerCase().includes('admin') && credentials.password.length > 3) {
        const adminUser = {
          id: 'demo-admin-001',
          email: credentials.email,
          username: 'admin',
          role: 'admin'
        };
        
        localStorage.setItem('token', 'demo-admin-token-123');
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        window.location.href = '/admin';
        return;
      }
      
      setError('არასწორი ემეილი ან პაროლი. ადმინისთვის გამოიყენეთ ემეილი რომელიც შეიცავს "admin"-ს');

    } catch (err) {
      console.error('Login error:', err);
      
      // Fallback - demo mode
      if (credentials.email.toLowerCase().includes('admin') && credentials.password.length > 3) {
        const adminUser = {
          id: 'demo-admin-001',
          email: credentials.email,
          username: 'admin',
          role: 'admin'
        };
        
        localStorage.setItem('token', 'demo-admin-token-123');
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        window.location.href = '/admin';
        return;
      }
      
      setError('შეცდომა სერვერთან კავშირში. გამოიყენეთ demo: admin@example.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        width: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>ადმინის პანელი</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
          შედით თქვენი ადმინის ანგარიშით
        </p>
        
        <div style={{ 
          background: '#e7f3ff', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          fontSize: '14px',
          color: '#0066cc'
        }}>
          <strong>💡 დმო რეჟიმი:</strong><br/>
          • რეალური API: ნებისმიერი email/password<br/>
          • Demo: email-ში უნდა იყოს "admin"
        </div>

        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            borderLeft: '4px solid #c33',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              ემეილი:
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              placeholder="admin@example.com"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              required
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              პაროლი:
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'შესვლა...' : '🔐 შესვლა'}
          </button>
        </form>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '25px', 
          paddingTop: '20px', 
          borderTop: '1px solid #eee' 
        }}>
          <a 
            href="/" 
            style={{ 
              color: '#667eea', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            ← საიტზე დაბრუნება
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;