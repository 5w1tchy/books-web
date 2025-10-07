import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');

  // თუ token არ არის, გადაამისამართე ლოგინზე
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // თუ adminOnly არის true, შეამოწმე admin როლი
  if (adminOnly && userData) {
    try {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
      }
    } catch (error) {
      return <Navigate to="/admin/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;