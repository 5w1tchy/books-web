import React from 'react';
import './AuthModal.css';

function AuthModal({ type, onClose }) {
  const isLogin = type === 'login';

  const handleSubmit = (event) => {
    event.preventDefault();
    // აქ დაამატებთ ავტორიზაციის/რეგისტრაციის ლოგიკას
    console.log('Form submitted');
    onClose(); // ფორმის დახურვა გაგზავნის შემდეგ
  };

  return (
    // Overlay-ზე დაკლიკებით დავხურავთ მოდალს
    <div className="modal-overlay" onClick={onClose}>
      {/* თავად მოდალის კონტენტზე კლიკი არ დახურავს მას */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <h2>{isLogin ? 'ავტორიზაცია' : 'რეგისტრაცია'}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">ელ. ფოსტა</label>
            <input type="email" id="email" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">პაროლი</label>
            <input type="password" id="password" required />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirm-password">გაიმეორეთ პაროლი</label>
              <input type="password" id="confirm-password" required />
            </div>
          )}
          
          <button type="submit" className="submit-btn">
            {isLogin ? 'შესვლა' : 'დარეგისტრირება'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
