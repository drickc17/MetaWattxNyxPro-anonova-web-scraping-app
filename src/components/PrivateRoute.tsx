import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isVerified } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/start-scraping" />;
  }

  if (!isVerified) {
    return <Navigate to="/verify-email" />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
