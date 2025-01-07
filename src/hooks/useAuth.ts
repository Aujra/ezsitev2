import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const hasRole = (role: UserRole) => {
    return context.user?.roles.includes(role) ?? false;
  };

  const isAdmin = () => hasRole('admin');

  return {
    ...context,
    hasRole,
    isAdmin,
  };
};
