const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

type RequestOptions = {
  headers?: Record<string, string>
  signal?: AbortSignal
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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new HttpError(response.status, response.statusText, data)
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json()
}

function getHeaders(customHeaders?: Record<string, string>): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...customHeaders,
  })

  return headers
}

export const httpClient = {
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(options.headers),
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
      headers: getHeaders(options.headers),
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
      headers: getHeaders(options.headers),
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
      headers: getHeaders(options.headers),
      body: data ? JSON.stringify(data) : undefined,
      signal: options.signal,
    })

    return handleResponse<T>(response)
  },

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(options.headers),
      signal: options.signal,
    })

    return handleResponse<T>(response)
  },
}

export { HttpError }
