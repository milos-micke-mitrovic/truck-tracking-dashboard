import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { httpClient } from '@/shared/api/http-client'
import type { PageResponse, PageParams } from '@/shared/types'
import type {
  User,
  UserListItem,
  UserCreateRequest,
  UserUpdateRequest,
  UserFilters,
} from '../types'
import { adminKeys } from './keys'

// API functions
async function fetchUsers(
  params: UserFilters & PageParams
): Promise<PageResponse<UserListItem>> {
  const searchParams = new URLSearchParams()
  if (params.page !== undefined) searchParams.set('page', String(params.page + 1))
  if (params.size !== undefined) searchParams.set('size', String(params.size))
  if (params.sortBy) searchParams.set('sortBy', params.sortBy)
  if (params.sortDir) searchParams.set('sortDir', params.sortDir)
  if (params.name) searchParams.set('name', params.name)
  if (params.email) searchParams.set('email', params.email)
  if (params.username) searchParams.set('username', params.username)
  if (params.department) searchParams.set('department', params.department)
  if (params.role && params.role !== 'all') searchParams.set('role', params.role)
  if (params.status && params.status !== 'all')
    searchParams.set('status', params.status)
  if (params.companyId) searchParams.set('companyId', String(params.companyId))

  return httpClient.get(`/users?${searchParams}`)
}

async function fetchUser(id: number): Promise<User> {
  return httpClient.get(`/users/${id}`)
}

async function fetchUserByEmail(email: string): Promise<User> {
  return httpClient.get(`/users/email/${encodeURIComponent(email)}`)
}

async function fetchUsersByRole(role: string): Promise<UserListItem[]> {
  return httpClient.get(`/users/role/${role}`)
}

async function fetchUsersByStatus(status: string): Promise<UserListItem[]> {
  return httpClient.get(`/users/status/${status}`)
}

async function fetchActiveUsers(): Promise<UserListItem[]> {
  return httpClient.get('/users/active')
}

async function searchUsers(
  firstName: string,
  lastName: string
): Promise<UserListItem[]> {
  const searchParams = new URLSearchParams()
  if (firstName) searchParams.set('firstName', firstName)
  if (lastName) searchParams.set('lastName', lastName)
  return httpClient.get(`/users/search?${searchParams}`)
}

async function createUser(data: UserCreateRequest): Promise<User> {
  return httpClient.post('/users', data)
}

async function updateUser(id: number, data: UserUpdateRequest): Promise<User> {
  return httpClient.put(`/users/${id}`, data)
}

async function deleteUser(id: number): Promise<void> {
  return httpClient.delete(`/users/${id}`)
}

async function toggleUserStatus(id: number): Promise<User> {
  return httpClient.patch(`/users/${id}/toggle-status`)
}

// Hooks
export function useUsers(params: UserFilters & PageParams = {}) {
  return useQuery({
    queryKey: adminKeys.usersList(params),
    queryFn: () => fetchUsers(params),
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: adminKeys.user(id),
    queryFn: () => fetchUser(id),
    enabled: id > 0,
  })
}

export function useUserByEmail(email: string) {
  return useQuery({
    queryKey: [...adminKeys.users(), 'email', email],
    queryFn: () => fetchUserByEmail(email),
    enabled: !!email,
  })
}

export function useUsersByRole(role: string) {
  return useQuery({
    queryKey: adminKeys.usersByRole(role),
    queryFn: () => fetchUsersByRole(role),
    enabled: !!role,
  })
}

export function useUsersByStatus(status: string) {
  return useQuery({
    queryKey: adminKeys.usersByStatus(status),
    queryFn: () => fetchUsersByStatus(status),
    enabled: !!status,
  })
}

export function useActiveUsers() {
  return useQuery({
    queryKey: [...adminKeys.users(), 'active'],
    queryFn: fetchActiveUsers,
  })
}

export function useSearchUsers(firstName: string, lastName: string) {
  return useQuery({
    queryKey: [...adminKeys.users(), 'search', firstName, lastName],
    queryFn: () => searchUsers(firstName, lastName),
    enabled: !!firstName || !!lastName,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateRequest }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
    },
  })
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
    },
  })
}
