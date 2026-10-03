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
        color: '#9AA8B2',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(47, 128, 237, 0.2)',
            borderTopColor: '#2F80ED',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px auto'
          }} />
          <p style={{ fontSize: '13px', margin: 0 }}>Verifying credentials...</p>
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
