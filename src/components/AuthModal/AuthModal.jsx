// src/components/AuthModal/AuthModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = ({ type, onClose, onSwitch, redirectTo, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const [backendWarning, setBackendWarning] = useState(null);

  const { login, register } = useAuth();
  const [currentType, setCurrentType] = useState(type);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentType(type);
    setEmail('');
    setUsername('');
    setPassword('');
    setErrors({});
    setApiError(null);
    setBackendWarning(null);
  }, [type]);

  useEffect(() => {
    if (currentType === 'register') {
      checkPasswordStrength(password);
    } else {
      setPasswordStrength({ score: 0, label: '', color: '' });
    }
  }, [password, currentType]);

  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      return;
    }
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;

    const finalScore = Math.min(Math.floor(score / 1.2), 4);
    const strengthLevels = [
      { label: '', color: '' },
      { label: 'ძალიან სუსტი', color: '#e74c3c' },
      { label: 'სუსტი', color: '#f1c40f' },
      { label: 'საშუალო', color: '#2ecc71' },
      { label: 'ძლიერი', color: '#27ae60' },
    ];
    setPasswordStrength({ score: finalScore, ...strengthLevels[finalScore] });
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'ელ. ფოსტის ველი სავალდებულოა.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'გთხოვთ, მიუთითოთ კორექტული ელ. ფოსტა.';
    if (currentType === 'register' && !username) newErrors.username = 'მომხმარებლის სახელის ველი სავალდებულოა.';
    if (!password) newErrors.password = 'პაროლის ველი სავალდებულოა.';
    else if (currentType === 'register' && password.length < 8) newErrors.password = 'პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setBackendWarning(null);
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (currentType === 'login') {
        await login(email, password);
        if (onSuccess) onSuccess();
        if (redirectTo) navigate(redirectTo, { replace: true });
        onClose();
      } else {
        const responseData = await register({ email, username, password });
        if (responseData.password_warning) {
          setBackendWarning(responseData.password_warning);
        } else {
          if (onSuccess) onSuccess();
          if (redirectTo) navigate(redirectTo, { replace: true });
          onClose();
        }
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitch = () => onSwitch(currentType === 'login' ? 'register' : 'login');
  const isLogin = currentType === 'login';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>{isLogin ? 'ავტორიზაცია' : 'რეგისტრაცია'}</h2>
        
        {backendWarning ? (
          <div className="backend-warning">
            <h4>რეგისტრაცია წარმატებულია, მაგრამ...</h4>
            <p>{backendWarning.message}</p>
            {backendWarning.suggestions && (
              <ul>
                {backendWarning.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            )}
            <button onClick={onClose} className="submit-btn">გასაგებია</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {apiError && <p className="api-error-message">{apiError}</p>}
            <div className="form-group">
              <label htmlFor="email">ელ. ფოსტა</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              {errors.email && <p className="validation-error">{errors.email}</p>}
            </div>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="username">მომხმარებლის სახელი</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                {errors.username && <p className="validation-error">{errors.username}</p>}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="password">პაროლი</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              {errors.password && <p className="validation-error">{errors.password}</p>}
              
              {!isLogin && password.length > 0 && (
                <div className="password-strength-meter">
                  <div className="strength-bars">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="strength-bar"
                        style={{ backgroundColor: index < passwordStrength.score ? passwordStrength.color : '#eee' }}
                      ></div>
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <span className="password-feedback" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  )}
                </div>
              )}
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'იტვირთება...' : (isLogin ? 'შესვლა' : 'რეგისტრაცია')}
            </button>
          </form>
        )}

        {!backendWarning && (
          <p className="switch-form-text">
            {isLogin ? "არ გაქვთ ანგარიში?" : "უკვე გაქვთ ანგარიში?"}
            <button onClick={handleSwitch} className="switch-form-btn">
              {isLogin ? "რეგისტრაცია" : "ავტორიზაცია"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
