import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import './Profile.css';

const Profile = () => {
    const { user, changePassword } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [passwordScore, setPasswordScore] = useState(null);

    // Real-time password strength calculation (mirrors backend logic)
    const calculatePasswordStrength = (pwd) => {
        const l = pwd.length;
        let hasL = false, hasU = false, hasD = false, hasS = false;

        for (let i = 0; i < pwd.length; i++) {
            const c = pwd[i];
            if (c >= 'a' && c <= 'z') hasL = true;
            else if (c >= 'A' && c <= 'Z') hasU = true;
            else if (c >= '0' && c <= '9') hasD = true;
            else hasS = true;
        }

        let classes = 0;
        if (hasL) classes++;
        if (hasU) classes++;
        if (hasD) classes++;
        if (hasS) classes++;

        // Scoring heuristic (matches backend)
        if (l >= 14 && classes >= 3) return 4;
        if (l >= 12 && classes >= 3) return 3;
        if (l >= 10 && classes >= 2) return 2;
        if (l >= 8) return 1;
        return 0;
    };

    // Update password strength in real-time
    const handleNewPasswordChange = (e) => {
        const pwd = e.target.value;
        setNewPassword(pwd);
        if (pwd.length > 0) {
            setPasswordScore(calculatePasswordStrength(pwd));
        } else {
            setPasswordScore(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Client-side validation
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'ახალი პაროლები არ ემთხვევა' });
            return;
        }

        if (newPassword.length < 8) {
            setMessage({ type: 'error', text: 'პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო' });
            return;
        }

        try {
            setLoading(true);
            const result = await changePassword(oldPassword, newPassword);

            // Show warning if password is weak
            if (result.password_warning) {
                setMessage({
                    type: 'warning',
                    text: `პაროლი შეიცვალა! ${result.password_warning.message || ''}`
                });
            } else {
                setMessage({ type: 'success', text: 'პაროლი წარმატებით შეიცვალა!' });
            }

            // Clear form
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordScore(null);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'პაროლის შეცვლა ვერ მოხერხდა'
            });
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthLabel = (score) => {
        const labels = ['ძალიან სუსტი', 'სუსტი', 'საშუალო', 'კარგი', 'ძლიერი'];
        return labels[score] || '';
    };

    const getPasswordStrengthColor = (score) => {
        const colors = ['#e74c3c', '#e67e22', '#f39c12', '#2ecc71', '#27ae60'];
        return colors[score] || '#95a5a6';
    };

    const getPasswordStrengthHint = (score) => {
        if (score === 4) return 'შესანიშნავია! 🎉';
        if (score === 3) return '14+ სიმბოლო მიიღწევს უმაღლეს დონეზე';
        if (score === 2) return '12+ სიმბოლო და 3 ტიპი (A-Z, a-z, 0-9, !@#) უკეთესია';
        if (score === 1) return '10+ სიმბოლო და მეტი ვარიაციები საჭიროა';
        return '8+ სიმბოლო მინიმუმ, გამოიყენე A-Z, a-z, 0-9, სიმბოლოები';
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h1 className="profile-title">პროფილი</h1>

                <div className="user-info">
                    <div className="info-row">
                        <span className="info-label">მომხმარებელი:</span>
                        <span className="info-value">{user?.username}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">ელ. ფოსტა:</span>
                        <span className="info-value">{user?.email}</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">როლი:</span>
                        <span className="info-value role-badge">{user?.role}</span>
                    </div>
                </div>

                <div className="divider"></div>

                <h2 className="section-title">პაროლის შეცვლა</h2>

                <form onSubmit={handleSubmit} className="password-form">
                    <div className="form-group">
                        <label htmlFor="oldPassword">მიმდინარე პაროლი</label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">ახალი პაროლი</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            required
                            disabled={loading}
                            minLength={8}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">გაიმეორეთ ახალი პაროლი</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                            minLength={8}
                        />
                    </div>

                    {passwordScore !== null && (
                        <div className="password-strength">
                            <span className="strength-label">პაროლის სიძლიერე:</span>
                            <div className="strength-bar-container">
                                <div
                                    className="strength-bar"
                                    style={{
                                        width: `${(passwordScore + 1) * 20}%`,
                                        backgroundColor: getPasswordStrengthColor(passwordScore)
                                    }}
                                ></div>
                            </div>
                            <div className="strength-info">
                                <span
                                    className="strength-text"
                                    style={{ color: getPasswordStrengthColor(passwordScore) }}
                                >
                                    {getPasswordStrengthLabel(passwordScore)}
                                </span>
                                <span className="strength-hint">
                                    {getPasswordStrengthHint(passwordScore)}
                                </span>
                            </div>
                        </div>
                    )}

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'იცვლება...' : 'პაროლის შეცვლა'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
