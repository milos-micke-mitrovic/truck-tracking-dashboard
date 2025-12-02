import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster, toast } from 'sonner'
import { AuthProvider } from '@/features/auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred'
        toast.error(message)
      },
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
        {children}
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </QueryClientProvider>
  )
}
