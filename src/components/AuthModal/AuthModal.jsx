import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth'; // <-- იმპორტი useAuth.js-დან
import './AuthModal.css';

const AuthModal = ({ type, onClose, onSwitch }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });

  const { login, register } = useAuth();
  const [currentType, setCurrentType] = useState(type);

  useEffect(() => {
    setCurrentType(type);
    setErrors({});
    setApiError(null);
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
    let label = '';
    let color = '';

    if (!pass) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      return;
    }
    
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/\d]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;

    const finalScore = Math.min(Math.floor(score / 1.5), 4);

    switch (finalScore) {
      case 1:
        label = 'ძალიან სუსტი';
        color = '#e74c3c';
        break;
      case 2:
        label = 'სუსტი';
        color = '#f1c40f';
        break;
      case 3:
        label = 'საშუალო';
        color = '#2ecc71';
        break;
      case 4:
        label = 'ძლიერი';
        color = '#27ae60';
        break;
      default:
        label = '';
    }
    setPasswordStrength({ score: finalScore, label, color });
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
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (currentType === 'login') {
        await login(email, password);
      } else {
        await register({ email, username, password });
      }
      onClose();
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
                      style={{
                        backgroundColor: index < passwordStrength.score ? passwordStrength.color : '#eee',
                      }}
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
        <p className="switch-form-text">
          {isLogin ? "არ გაქვთ ანგარიში?" : "უკვე გაქვთ ანგარიში?"}
          <button type="button" onClick={handleSwitch} className="switch-form-btn">
            {isLogin ? "რეგისტრაცია" : "ავტორიზაცია"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;

