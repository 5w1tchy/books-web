// Custom hook for user management logic
import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

const useUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [actionLoading, setActionLoading] = useState({});
    const [apiError, setApiError] = useState("");
    const [filters, setFilters] = useState({
        role: "",
        verified: "",
    });

    const getToken = () => localStorage.getItem("token") || localStorage.getItem("accessToken");

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setApiError("");

        try {
            const token = getToken();
            const params = new URLSearchParams({
                page: currentPage.toString(),
                size: "20",
                ...(searchTerm && { q: searchTerm }),
                ...(filters.role && { role: filters.role }),
                ...(filters.verified && { verified: filters.verified }),
            });

            const url = `${API_BASE_URL}/admin/users?${params}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();

                // Handle different API response structures
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
                }

                setUsers(usersList);
                setTotal(totalCount);
                setTotalPages(Math.ceil(totalCount / 20));
                setApiError("");
            } else {
                const errorText = await response.text();

                if (response.status === 401) {
                    setApiError("არაავტორიზებული - გთხოვთ თავიდან შეხვიდეთ");
                    localStorage.clear();
                } else if (response.status === 403) {
                    setApiError("წვდომა აკრძალულია - საჭიროა ადმინის უფლებები");
                } else {
                    setApiError(`შეცდომა: ${response.status} ${errorText}`);
                }

                setUsers([]);
                setTotal(0);
                setTotalPages(1);
            }
        } catch (error) {
            console.error("❌ Fetch error:", error);
            setApiError(`ქსელის შეცდომა: ${error.message}`);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, filters]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleBanUser = async (userId) => {
        if (!window.confirm("დარწმუნებული ხართ, რომ გსურთ მომხმარებლის დაბლოკვა?")) {
            return;
        }

        setActionLoading((prev) => ({ ...prev, [userId]: true }));

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ban`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                await fetchUsers();
            } else {
                const errorText = await response.text();
                alert(`შეცდომა დაბლოკვისას: ${errorText}`);
            }
        } catch (error) {
            console.error("Ban error:", error);
            alert(`შეცდომა: ${error.message}`);
        } finally {
            setActionLoading((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const handleUnbanUser = async (userId) => {
        setActionLoading((prev) => ({ ...prev, [userId]: true }));

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/unban`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                await fetchUsers();
            } else {
                const errorText = await response.text();
                alert(`შეცდომა განბლოკვისას: ${errorText}`);
            }
        } catch (error) {
            console.error("Unban error:", error);
            alert(`შეცდომა: ${error.message}`);
        } finally {
            setActionLoading((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        setActionLoading((prev) => ({ ...prev, [userId]: true }));

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (response.ok) {
                await fetchUsers();
            } else {
                const errorText = await response.text();
                alert(`შეცდომა როლის ცვლილებისას: ${errorText}`);
            }
        } catch (error) {
            console.error("Role change error:", error);
            alert(`შეცდომა: ${error.message}`);
        } finally {
            setActionLoading((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const handleResendVerification = async (userId) => {
        setActionLoading((prev) => ({ ...prev, [`verify-${userId}`]: true }));

        try {
            const token = getToken();
            const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/resend-verification`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                alert("ვერიფიკაციის ბმული წარმატებით გაიგზავნა");
            } else {
                const errorText = await response.text();
                alert(`შეცდომა: ${errorText}`);
            }
        } catch (error) {
            console.error("Resend verification error:", error);
            alert(`შეცდომა: ${error.message}`);
        } finally {
            setActionLoading((prev) => ({ ...prev, [`verify-${userId}`]: false }));
        }
    };

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({ ...prev, [filterName]: value }));
        setCurrentPage(1);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    return {
        // State
        users,
        loading,
        searchTerm,
        currentPage,
        totalPages,
        total,
        actionLoading,
        apiError,
        filters,

        // Actions
        setCurrentPage,
        handleBanUser,
        handleUnbanUser,
        handleRoleChange,
        handleResendVerification,
        handleFilterChange,
        handleSearch,
        fetchUsers,
    };
};

export default useUserManagement;
