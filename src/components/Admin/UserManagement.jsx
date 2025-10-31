import useUserManagement from '../../hooks/useUserManagement';
import UsersTable from './UsersTable';

const UserManagement = () => {
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    total,
    setCurrentPage,
    actionLoading,
    apiError,
    filters,
    setFilters,
    handleBanUser,
    handleUnbanUser,
    handleRoleChange,
    handleResendVerification
  } = useUserManagement();



  return (
    <div style={{ padding: "20px" }}>
      <h2>მომხმარებლების მართვა</h2>

      {/* Search and Filters */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="ძებნა (ემეილი, სახელი)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            flex: "1",
            minWidth: "200px"
          }}
        />

        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}
        >
          <option value="">ყველა როლი</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={filters.verified}
          onChange={(e) => setFilters({ ...filters, verified: e.target.value })}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #ddd"
          }}
        >
          <option value="">ყველა სტატუსი</option>
          <option value="true">ვერიფიცირებული</option>
          <option value="false">არავერიფიცირებული</option>
        </select>
      </div>

      {/* Error Display */}
      {apiError && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          borderRadius: "4px",
          border: "1px solid #f5c6cb"
        }}>
          <strong>შეცდომა:</strong> {apiError}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>იტვირთება...</p>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div style={{ marginBottom: "10px", color: "#666" }}>
            <p>ნაპოვნია: {total} მომხმარებელი</p>
          </div>

          {/* Users Table */}
          <UsersTable
            users={users}
            actionLoading={actionLoading}
            onBan={handleBanUser}
            onUnban={handleUnbanUser}
            onRoleChange={handleRoleChange}
            onResendVerification={handleResendVerification}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              alignItems: "center"
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  backgroundColor: currentPage === 1 ? "#f5f5f5" : "white",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer"
                }}
              >
                წინა
              </button>

              <span>
                გვერდი {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  backgroundColor: currentPage === totalPages ? "#f5f5f5" : "white",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                }}
              >
                შემდეგი
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagement;