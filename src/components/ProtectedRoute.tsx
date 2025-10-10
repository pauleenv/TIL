"use client";

import React from 'react';
import { useSession } from '@/components/SessionContextProvider';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useSession();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>; // Or a spinner component
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;