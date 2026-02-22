import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/features/auth'
import { PodNotificationProvider } from '@/features/routes/context/pod-notification-context'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PodNotificationProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </PodNotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
