import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import AppLayout from './ui/AppLayout';
import ProtectedRoute from './ui/ProtectedRoute';

// Create routes with a layout and protected guards for app sections
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'items', element: <Items /> },
      { path: 'inventory', element: <Inventory /> },
      { path: 'reports', element: <Reports /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;
