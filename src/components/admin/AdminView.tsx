import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { getStoredAdminToken, getStoredAdminUser } from '../../services/apartmentService';

interface AdminViewProps {
  onBackToPublic: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onBackToPublic }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!getStoredAdminToken();
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div>
      {!isAuthenticated ? (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToPublic={onBackToPublic}
        />
      ) : (
        <AdminDashboard
          onBackToPublic={onBackToPublic}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};
