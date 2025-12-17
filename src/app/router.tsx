import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { RouteGuard } from './layouts/route-guard'
import { DashboardLayout } from './layouts/dashboard-layout'
import { NotFoundPage } from './pages/not-found-page'
import { ErrorBoundary } from '@/shared/components'
import { Spinner } from '@/shared/ui'

// Lazy load feature pages
const AdminPage = lazy(() =>
  import('@/features/admin/pages/admin-page').then((m) => ({
    default: m.AdminPage,
  }))
)
const LoginPage = lazy(() =>
  import('@/features/auth/pages/login-page').then((m) => ({
    default: m.LoginPage,
  }))
)
const RoutesPage = lazy(() =>
  import('@/features/routes/pages/routes-page').then((m) => ({
    default: m.RoutesPage,
  }))
)

// Loading fallback for lazy-loaded pages
function PageLoadingFallback() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

// Wrapper for lazy-loaded pages with error boundary and suspense
function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoadingFallback />}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export const router = createBrowserRouter([
  // Public routes (no auth required)
  {
    element: (
      <RouteGuard requireAuth={false}>
        <Outlet />
      </RouteGuard>
    ),
    children: [
      {
        path: '/login',
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
    ],
  },
  // Protected routes (auth required)
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/admin" replace />,
      },
      {
        path: '/admin',
        element: (
          <LazyPage>
            <AdminPage />
          </LazyPage>
        ),
      },
      {
        path: '/routes',
        element: (
          <LazyPage>
            <RoutesPage />
          </LazyPage>
        ),
      },
    ],
  },
  // 404 catch-all
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
