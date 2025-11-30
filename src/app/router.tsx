import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from './layouts/auth-layout'
import { DashboardLayout } from './layouts/dashboard-layout'
import { AdminPage } from '@/features/admin/pages/admin-page'
import { LoginPage } from '@/features/auth/pages/login-page'

export const router = createBrowserRouter([
  // Public routes (auth layout)
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  // Protected routes (dashboard layout)
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/admin" replace />,
      },
      {
        path: '/admin',
        element: <AdminPage />,
      },
    ],
  },
])
