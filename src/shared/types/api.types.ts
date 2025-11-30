export type ApiResponse<T> = {
  data: T
  message?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalCount: number
    totalPages: number
  }
}

export type SortDirection = 'asc' | 'desc'

export type SortConfig<T> = {
  field: keyof T
  direction: SortDirection
}

export type PaginationParams = {
  page?: number
  pageSize?: number
}

export type FilterParams = {
  search?: string
  [key: string]: unknown
}
