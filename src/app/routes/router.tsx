import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { RouteGuard } from './route-guard'
import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { NotFoundPage } from './not-found-page'
import { ErrorBoundary } from './error-boundary'
import { Spinner } from '@/shared/ui'
import { useAuth, getDefaultRoute } from '@/features/auth'

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
const TenantsPage = lazy(() =>
  import('@/features/tenants/pages/tenants-page').then((m) => ({
    default: m.TenantsPage,
  }))
)

// Redirects to the user's default route based on role
function DefaultRedirect() {
  const { user } = useAuth()
  return <Navigate to={getDefaultRoute(user)} replace />
}

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
        element: <DefaultRedirect />,
      },
      {
        path: '/admin',
        element: (
          <RouteGuard allowedRoles={['ADMIN']}>
            <LazyPage>
              <AdminPage />
            </LazyPage>
          </RouteGuard>
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
      {
        path: '/tenants',
        element: (
          <RouteGuard allowedRoles={['SUPER_ADMIN']}>
            <LazyPage>
              <TenantsPage />
            </LazyPage>
          </RouteGuard>
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
