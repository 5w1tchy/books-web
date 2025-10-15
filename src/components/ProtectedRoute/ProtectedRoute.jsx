// src/components/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../../context/useAuth';

/**
 * ProtectedRoute აღარ გადამისამართებს ლოგინზე
 * და არ REFRESH-ს.
 * უბრალოდ აბრუნებს children ან adminOnly შემთხვევისთვის null.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  // თუ მომხმარებელი არ არის ავტორიზირებული
  if (!user) {
    // უბრალოდ აბრუნებს children, მაგალითად BookDetails გამოიტანს AuthModal
    return children;
  }

  // თუ adminOnly და user.role არ არის admin
  if (adminOnly && user.role !== 'admin') {
    // აქ შეიძლება null ან 404 fallback
    return null;
  }

  return children;
};

export default ProtectedRoute;
