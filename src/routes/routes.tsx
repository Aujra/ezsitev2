import React from 'react';
import { RouteObject } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Login from '../components/Auth/Login';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <div>Admin Dashboard</div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/characters',
    element: (
      <ProtectedRoute>
        <div>Character Management</div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <div>Settings</div>
      </ProtectedRoute>
    ),
  },
];
