import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        color: '#94A3B8'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(56, 189, 248, 0.2)',
            borderTopColor: '#38BDF8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px auto'
          }} />
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Sign in to use this feature.',
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};
