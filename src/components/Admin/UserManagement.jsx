import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState({});
  const [apiError, setApiError] = useState(''); // ახალი state ერორებისთვის
  const [filters, setFilters] = useState({
    role: '',
    verified: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    setApiError(''); // ერორს წაშლა

    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      console.log('🔑 Token preview:', token?.substring(0, 50) + '...');

      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: '20',
        ...(searchTerm && { q: searchTerm }),
        ...(filters.role && { role: filters.role }),
        ...(filters.verified && { verified: filters.verified })
      });

      const url = `${API_BASE_URL}/admin/users?${params}`;
      console.log('🌐 Requesting URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response Success:', data);
        console.log('📊 Response structure:', {
          hasItems: !!data.items,
          hasData: !!data.data,
          hasUsers: !!data.users,
          isArray: Array.isArray(data),
          keys: Object.keys(data)
        });

        // ყველა შესაძლო ვარიანტის შემოწმება
        let usersList = [];
        let totalCount = 0;

        if (data.items && Array.isArray(data.items)) {
          usersList = data.items;
          totalCount = data.total || data.items.length;
        } else if (data.data && Array.isArray(data.data)) {
          usersList = data.data;
          totalCount = data.total || data.data.length;
        } else if (data.users && Array.isArray(data.users)) {
          usersList = data.users;
          totalCount = data.total || data.users.length;
        } else if (Array.isArray(data)) {
          usersList = data;
          totalCount = data.length;
        } else {
          console.warn('⚠️ Unknown API response structure:', data);
          throw new Error('Unknown response structure');
        }

        console.log('👥 Found users:', usersList.length);
        console.log('📊 Users sample:', usersList.slice(0, 2));

        setUsers(usersList);
        setTotal(totalCount);
        setTotalPages(Math.ceil(totalCount / 20));
        setApiError(''); // Clear error on success

      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });

        if (response.status === 401) {
          setApiError('ავტორიზაცია არასწორია - გთხოვთ ხელახლა შეხვიდეთ');
          // შესაძლოა სჭირდებოდეს logout logic
        } else if (response.status === 403) {
          setApiError('არ გაქვთ ამ რესურსზე წვდომის უფლება');
        } else if (response.status === 404) {
          setApiError('API endpoint ვერ მოიძებნა');
        } else {
          setApiError(`API შეცდომა: ${response.status} - ${response.statusText}`);
        }

        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('💥 Fetch Error:', error);

      if (!apiError) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          setApiError('ქსელის შეცდომა - სერვერთან კავშირი ვერ დამყარდა');
        } else {
          setApiError('არცნობილი შეცდომა მონაცემების ჩატვირთვისას');
        }
      }

      // Demo data როგორც fallback
      console.log('🎭 Using demo data as fallback');
      const mockUsers = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          email: 'admin@books.ge',
          username: 'admin',
          role: 'admin',
          status: 'active',
          email_verified_at: '2024-01-15T10:30:00Z',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          email: 'user1@example.com',
          username: 'user1',
          role: 'user',
          status: 'active',
          email_verified_at: '2024-02-10T14:20:00Z',
          created_at: '2024-02-01T00:00:00Z'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          email: 'user2@gmail.com',
          username: 'user2',
          role: 'user',
          status: 'banned',
          email_verified_at: null,
          created_at: '2024-03-01T00:00:00Z'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440004',
          email: 'test@test.com',
          username: 'testuser',
          role: 'user',
          status: 'active',
          email_verified_at: '2024-03-15T08:45:00Z',
          created_at: '2024-03-10T00:00:00Z'
        }
      ];

      let filteredUsers = mockUsers;

      // ფილტრების გამოყენება demo data-ზე
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.email.toLowerCase().includes(searchLower) ||
          (user.username && user.username.toLowerCase().includes(searchLower))
        );
      }

      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      if (filters.verified) {
        const isVerified = filters.verified === 'true';
        filteredUsers = filteredUsers.filter(user =>
          isVerified ? user.email_verified_at : !user.email_verified_at
        );
      }

      setUsers(filteredUsers);
      setTotal(filteredUsers.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // სხვა ფუნქციები უცვლელი...
  const handleBanUser = async (userId) => {
    if (!confirm('დარწმუნებული ხართ, რომ გსურთ ამ მომხმარებლის დაბანვა?')) return;

    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const token = localStorage.getItem('token');
      console.log('🚫 Banning user:', userId);

      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🚫 Ban response:', response.status);

      if (response.ok) {
        await fetchUsers(); // Refresh list
        alert('მომხმარებელი დაიბანა');
      } else {
        const errorText = await response.text();
        console.error('Ban failed:', errorText);
        throw new Error('Ban failed');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      alert('შეცდომა მომხმარებლის დაბანვისას: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleUnbanUser = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchUsers(); // Refresh list
        alert('ბანი მოიხსნა');
      } else {
        throw new Error('Unban failed');
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      alert('შეცდომა ბანის მოხსნისას: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!confirm(`დარწმუნებული ხართ, რომ გსურთ როლის შეცვლა ${newRole}-ზე?`)) return;

    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        await fetchUsers(); // Refresh list
        alert('როლი შეიცვალა');
      } else {
        throw new Error('Role change failed');
      }
    } catch (error) {
      console.error('Error changing role:', error);
      alert('შეცდომა როლის შეცვლისას: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleResendVerification = async (userId) => {
    setActionLoading(prev => ({ ...prev, [userId + '_verify']: true }));
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/resend-verification`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('ვერიფიკაციის წერილი გაიგზავნა');
      } else {
        throw new Error('Resend failed');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      alert('შეცდომა ვერიფიკაციის წერილის გაგზავნისას: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId + '_verify']: false }));
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>
          მომხმარებლები იტვირთება...
        </div>
        <div style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
          API-ს ძალიან ნელა? ღია კონსოლი (F12) დეტალებისთვის
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>👥 მომხმარებლების მართვა</h2>
        <div style={{ color: '#666' }}>სულ: {total} მომხმარებელი</div>
      </div>

      {/* API Error Display */}
      {apiError && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <strong>API შეცდომა:</strong> {apiError}
            <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.8 }}>
              გამოყენებულია demo მონაცემები. კონსოლი (F12) შეამოწმეთ დეტალებისთვის.
            </div>
          </div>
        </div>
      )}

      {/* Debug Info - მხოლოდ development-ში */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          background: '#e3f2fd',
          border: '1px solid #2196f3',
          color: '#1565c0',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontSize: '13px'
        }}>
          <strong>🔧 Debug Info:</strong><br />
          Token: {localStorage.getItem('token') ? '✓ არსებობს' : '❌ არ არსებობს'}<br />
          Users Count: {users.length}<br />
          Current Page: {currentPage}<br />
          Search: "{searchTerm}" | Role: "{filters.role}" | Verified: "{filters.verified}"
        </div>
      )}

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="ძებნა (ემეილი/მომხმარებელი)..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '12px 15px',
            width: '300px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />

        <select
          value={filters.role}
          onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
          style={{
            padding: '12px 15px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          <option value="">ყველა როლი</option>
          <option value="user">მომხმარებელი</option>
          <option value="admin">ადმინი</option>
        </select>

        <select
          value={filters.verified}
          onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.value }))}
          style={{
            padding: '12px 15px',
            border: '2px solid #e1e5e9',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          <option value="">ყველა სტატუსი</option>
          <option value="true">ვერიფიცირებული</option>
          <option value="false">ვერ ვერიფიცირებული</option>
        </select>

        <button
          onClick={fetchUsers}
          style={{
            padding: '12px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 განახლება
        </button>
      </div>

      {/* რჩება უცვლელი - ტაბლი და pagination */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>ID</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>ემეილი</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>მომხმარებელი</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>როლი</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>სტატუსი</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>ვერიფიცირება</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>რეგისტრაცია</th>
              <th style={{ padding: '15px 12px', textAlign: 'left', borderBottom: '1px solid #ddd', fontWeight: '600' }}>ქმედებები</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px', color: '#666', fontSize: '13px' }}>
                  {user.id.slice(0, 8)}...
                </td>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>{user.username || '-'}</td>
                <td style={{ padding: '12px' }}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={actionLoading[user.id]}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      background: user.role === 'admin' ? '#28a745' : '#007bff',
                      color: 'white',
                      fontSize: '12px'
                    }}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: user.status === 'active' ? '#28a745' : '#dc3545',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '18px',
                      color: user.email_verified_at ? '#28a745' : '#dc3545'
                    }}>
                      {user.email_verified_at ? '✓' : '✗'}
                    </span>
                    {!user.email_verified_at && (
                      <button
                        onClick={() => handleResendVerification(user.id)}
                        disabled={actionLoading[user.id + '_verify']}
                        style={{
                          padding: '2px 6px',
                          background: '#ffc107',
                          color: 'black',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '10px'
                        }}
                      >
                        📧
                      </button>
                    )}
                  </div>
                </td>
                <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                  {new Date(user.created_at).toLocaleDateString('ka-GE')}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleBanUser(user.id)}
                        disabled={actionLoading[user.id]}
                        style={{
                          padding: '6px 12px',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: actionLoading[user.id] ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          opacity: actionLoading[user.id] ? 0.7 : 1
                        }}
                      >
                        {actionLoading[user.id] ? '...' : 'ბანი'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnbanUser(user.id)}
                        disabled={actionLoading[user.id]}
                        style={{
                          padding: '6px 12px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: actionLoading[user.id] ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          opacity: actionLoading[user.id] ? 0.7 : 1
                        }}
                      >
                        {actionLoading[user.id] ? '...' : 'ბანის მოხსნა'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '50px',
          color: '#666',
          background: 'white',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          {searchTerm ? 'ძებნის შედეგები ვერ მოიძებნა' : 'მომხმარებლები ვერ მოიძებნა'}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          marginTop: '20px'
        }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              background: currentPage === 1 ? '#f8f9fa' : 'white',
              borderRadius: '6px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            წინა
          </button>

          <span style={{ color: '#666' }}>
            გვერდი {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            style={{
              padding: '8px 16px',
              border: '1px solid #ddd',
              background: currentPage === totalPages ? '#f8f9fa' : 'white',
              borderRadius: '6px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            შემდეგი
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;