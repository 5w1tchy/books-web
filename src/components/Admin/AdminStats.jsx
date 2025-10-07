import React, { useState, useEffect } from 'react';

const AdminStats = () => {
  const [stats, setStats] = useState({
    users_total: 0,
    users_verified: 0,
    books_total: 0,
    signups_last_24h: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://books-api-7hu5.onrender.com/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 401) {
        setError('ავტორიზაცია აუცილებელია');
      } else {
        throw new Error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('სტატისტიკის ჩატვირთვა ვერ მოხერხდა');
      
      // Demo data as fallback
      setStats({
        users_total: 1247,
        users_verified: 1089,
        books_total: 856,
        signups_last_24h: 23
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>სტატისტიკა იტვირთება...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'სულ მომხმარებელი',
      value: stats.users_total?.toLocaleString() || '0',
      icon: '👥',
      color: '#007bff',
      bgColor: '#e3f2fd'
    },
    {
      title: 'ვერიფიცირებული',
      value: stats.users_verified?.toLocaleString() || '0',
      icon: '✅',
      color: '#28a745',
      bgColor: '#e8f5e9'
    },
    {
      title: 'სულ წიგნი',
      value: stats.books_total?.toLocaleString() || '0',
      icon: '📚',
      color: '#17a2b8',
      bgColor: '#e0f7fa'
    },
    {
      title: '24 საათში რეგისტრაცია',
      value: stats.signups_last_24h?.toLocaleString() || '0',
      icon: '📈',
      color: '#ffc107',
      bgColor: '#fff8e1'
    }
  ];

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>📊 სისტემის სტატისტიკა</h2>
        <button
          onClick={fetchStats}
          style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 განახლება
        </button>
      </div>

      {error && (
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          borderLeft: '4px solid #ffc107'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {statCards.map((card, index) => (
          <div
            key={index}
            style={{
              background: card.bgColor,
              padding: '25px',
              borderRadius: '12px',
              border: `2px solid ${card.color}`,
              textAlign: 'center',
              transition: 'transform 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>{card.icon}</div>
            <h3 style={{
              color: card.color,
              margin: '0 0 10px 0',
              fontSize: '32px',
              fontWeight: '700'
            }}>
              {card.value}
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '16px', fontWeight: '500' }}>
              {card.title}
            </p>
          </div>
        ))}
      </div>

      {/* დამატებითი ინფორმაცია */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>📈 სისტემის მდგომარეობა</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <strong>ვერიფიკაციის მაჩვენებელი:</strong>
            <div style={{
              marginTop: '5px',
              padding: '8px',
              background: '#e8f5e9',
              borderRadius: '6px',
              color: '#2e7d32'
            }}>
              {stats.users_total > 0 
                ? `${((stats.users_verified / stats.users_total) * 100).toFixed(1)}%`
                : '0%'
              }
            </div>
          </div>
          <div>
            <strong>დღევანდელი აქტივობა:</strong>
            <div style={{
              marginTop: '5px',
              padding: '8px',
              background: '#fff8e1',
              borderRadius: '6px',
              color: '#f57f17'
            }}>
              {stats.signups_last_24h} ახალი რეგისტრაცია
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;