// Users table component
const UsersTable = ({ users, actionLoading, onBan, onUnban, onRoleChange, onResendVerification }) => {
    if (users.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                <p>მომხმარებლები არ მოიძებნა</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("ka-GE");
    };

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>ID</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>ემეილი</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>სახელი</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>როლი</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>ვერიფიკაცია</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>სტატუსი</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>რეგისტრაცია</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>ქმედებები</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "12px" }}>{user.id?.substring(0, 8)}...</td>
                            <td style={{ padding: "12px" }}>{user.email}</td>
                            <td style={{ padding: "12px" }}>{user.username || "N/A"}</td>
                            <td style={{ padding: "12px" }}>
                                <select
                                    value={user.role}
                                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                                    disabled={actionLoading[user.id]}
                                    style={{
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        border: "1px solid #ddd",
                                    }}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td style={{ padding: "12px" }}>
                                {user.email_verified ? (
                                    <span style={{ color: "green" }}>✓ ვერიფიცირებული</span>
                                ) : (
                                    <div>
                                        <span style={{ color: "red" }}>✗ არავერიფიცირებული</span>
                                        <button
                                            onClick={() => onResendVerification(user.id)}
                                            disabled={actionLoading[`verify-${user.id}`]}
                                            style={{
                                                marginLeft: "8px",
                                                padding: "4px 8px",
                                                fontSize: "12px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            გაგზავნა
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td style={{ padding: "12px" }}>
                                {user.is_banned ? (
                                    <span style={{ color: "red", fontWeight: "bold" }}>დაბლოკილი</span>
                                ) : (
                                    <span style={{ color: "green" }}>აქტიური</span>
                                )}
                            </td>
                            <td style={{ padding: "12px", fontSize: "12px" }}>
                                {formatDate(user.created_at)}
                            </td>
                            <td style={{ padding: "12px" }}>
                                {user.is_banned ? (
                                    <button
                                        onClick={() => onUnban(user.id)}
                                        disabled={actionLoading[user.id]}
                                        style={{
                                            padding: "6px 12px",
                                            backgroundColor: "#28a745",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: actionLoading[user.id] ? "not-allowed" : "pointer",
                                            opacity: actionLoading[user.id] ? 0.6 : 1,
                                        }}
                                    >
                                        {actionLoading[user.id] ? "..." : "განბლოკვა"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onBan(user.id)}
                                        disabled={actionLoading[user.id]}
                                        style={{
                                            padding: "6px 12px",
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: actionLoading[user.id] ? "not-allowed" : "pointer",
                                            opacity: actionLoading[user.id] ? 0.6 : 1,
                                        }}
                                    >
                                        {actionLoading[user.id] ? "..." : "დაბლოკვა"}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
