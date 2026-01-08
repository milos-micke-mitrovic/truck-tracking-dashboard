import { AUTH_STORAGE_KEY } from '@/shared/utils'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

type RequestOptions = {
  headers?: Record<string, string>
  signal?: AbortSignal
  skipAuth?: boolean
}

class HttpError extends Error {
  status: number
  statusText: string
  data?: unknown

  constructor(status: number, statusText: string, data?: unknown) {
    super(`HTTP ${status}: ${statusText}`)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}

// Get token from localStorage
function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.token || null
    }
  } catch {
    // Invalid JSON
  }
  return null
}

// Clear auth and redirect on 401/403
function handleUnauthorized() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  window.location.href = '/login'
}

async function handleResponse<T>(response: Response): Promise<T> {
  // Handle both 401 (Unauthorized) and 403 (Forbidden) as auth errors
  if (response.status === 401 || response.status === 403) {
    handleUnauthorized()
    throw new HttpError(response.status, response.statusText)
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new HttpError(response.status, response.statusText, data)
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json()
}

function getHeaders(
  customHeaders?: Record<string, string>,
  skipAuth?: boolean
): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...customHeaders,
  })

  if (!skipAuth) {
    const token = getAuthToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  return headers
}

export const httpClient = {
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(options.headers, options.skipAuth),
      signal: options.signal,
    })

    return handleResponse<T>(response)
  },

  async post<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(options.headers, options.skipAuth),
      body: data ? JSON.stringify(data) : undefined,
      signal: options.signal,
    })

    return handleResponse<T>(response)
  },

  async put<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(options.headers, options.skipAuth),
      body: data ? JSON.stringify(data) : undefined,
      signal: options.signal,
    })

    return handleResponse<T>(response)
  },

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(options.headers, options.skipAuth),
      body: data ? JSON.stringify(data) : undefined,
      signal: options.signal,
    })

    return handleResponse<T>(response)
  },

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(options.headers, options.skipAuth),
      signal: options.signal,
    })

    return handleResponse<T>(response)
  },
}

export { HttpError }
