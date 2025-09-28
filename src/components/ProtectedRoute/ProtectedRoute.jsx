import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

// ეს კომპონენტი ამოწმებს, აქვს თუ არა მომხმარებელს გვერდზე წვდომის უფლება
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // სანამ ვამოწმებთ ავტორიზაციას, ვაჩვენებთ ჩატვირთვის ინდიკატორს
  if (loading) {
    return <div className="status-message">იტვირთება...</div>;
  }

  // თუ მომხმარებელი არ არის ავტორიზებული, გადავამისამართებთ მთავარ გვერდზე
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // თუ გვერდი მხოლოდ ადმინისთვისაა და მომხმარებელს არ აქვს 'admin' სტატუსი
  // (თქვენი API-დან /auth/me პასუხის მიხედვით)
  if (adminOnly && user.status !== 'admin') {
    // გადავამისამართებთ მთავარ გვერდზე
    return <Navigate to="/" replace />;
  }

  // თუ ყველა პირობა დაკმაყოფილებულია, ვაჩვენებთ დაცულ გვერდს
  return children;
};

export default ProtectedRoute;
