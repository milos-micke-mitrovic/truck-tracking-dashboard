// User status values match backend enum
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'

// User role values match backend enum
export type UserRole =
  | 'USER'
  | 'ADMIN'
  | 'MANAGER'
  | 'DRIVER'
  | 'DISPATCHER'
  | 'ACCOUNTING'

// User document type
export type UserDocument = {
  id: number
  type: string
  name: string
  path: string
  expirationDate: string | null
  createdAt: string
  updatedAt: string
}

// Full user entity from backend (UserFullResponseDto)
export type User = {
  id: number
  tenantId: number
  companyId: number | null
  email: string
  firstName: string
  lastName: string
  username: string | null
  department: string | null
  role: UserRole
  status: UserStatus
  createdBy: number | null
  updatedBy: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  documents: UserDocument[]
}

// Simplified user for list views (matches BE UserListResponseDto)
export type UserListItem = {
  id: number
  companyId: number | null
  companyName: string | null
  name: string
  username: string | null
  email: string
  department: string | null
  role: UserRole
  status: UserStatus
}

// Document request for create/update
export type UserDocumentRequest = {
  type: string
  tempFileName: string
  originalFileName: string
  expirationDate?: string
}

// Request type for creating a user (UserRequestDto)
export type UserCreateRequest = {
  tenantId: number
  companyId: number
  email: string
  firstName: string
  lastName: string
  password: string
  status?: UserStatus
  role?: UserRole
  username?: string
  department?: string
  createdBy?: number
  updatedBy?: number
  isActive?: boolean
  documents?: UserDocumentRequest[]
  documentIdsToDelete?: number[]
}

// Request type for updating a user
export type UserUpdateRequest = Partial<UserCreateRequest>

// Filters for user list (matches BE UserFilterRequest)
export type UserFilters = {
  name?: string
  email?: string
  username?: string
  department?: string
  role?: UserRole | 'all'
  status?: UserStatus | 'all'
  companyId?: number
}

// Document form value for creating/editing
export type UserDocumentFormValue = {
  id?: number
  type: string
  tempFileName?: string
  originalFileName?: string
  expirationDate?: string
  isNew?: boolean
}

// Form values for user sheet
export type UserFormValues = {
  companyId: number | null
  email: string
  firstName: string
  lastName: string
  username: string
  password: string
  department: string
  role: UserRole | ''
  status: UserStatus
  documents: UserDocumentFormValue[]
}

// Sheet props
export type UserSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: number // Pass ID, sheet will fetch full data
  onSuccess?: () => void
}
