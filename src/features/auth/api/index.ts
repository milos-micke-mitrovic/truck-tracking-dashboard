import { useMutation } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { LoginCredentials, LoginResponse } from '../types'

async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return httpClient.post('/auth/login', credentials)
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  })
}
