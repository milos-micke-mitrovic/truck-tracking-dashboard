import { useMutation } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { LoginCredentials, LoginResponse } from '../types'

// Query/Mutation keys
export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
}

// API functions
async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return httpClient.post('/auth/login', credentials, { skipAuth: true })
}

async function logout(): Promise<void> {
  return httpClient.post('/auth/logout', {})
}

// Hooks
export function useLogin() {
  return useMutation({
    mutationKey: authKeys.session(),
    mutationFn: login,
  })
}

export function useLogout() {
  return useMutation({
    mutationKey: authKeys.session(),
    mutationFn: logout,
  })
}
