// Company status from backend
export type CompanyStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'

// Subscription plans (backend format)
export type SubscriptionPlan = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE'

// Document from backend
export type CompanyDocument = {
  id: number
  type: string
  name: string
  path: string
  expirationDate: string | null
  createdAt: string
  updatedAt: string
}

// List item - what /api/companies returns (summary for table)
export type CompanyListItem = {
  id: number
  fullName: string
  displayName: string
  dotNumber: string
  mcNumber: string
  address: string
  phoneNumber: string
  emailDomain: string
  status: CompanyStatus
}

// Full company entity - what /api/companies/{id} returns (for edit form)
export type Company = {
  id: number
  tenantId: number
  fullName: string
  displayName: string
  dotNumber: string
  mcNumber: string
  address: string
  phoneNumber: string
  emailDomain: string
  status: CompanyStatus
  documents: CompanyDocument[]
}

// Request body for create/update
export type CompanyRequest = {
  tenantId: number
  fullName: string
  displayName: string
  dotNumber: string
  mcNumber: string
  address: string
  phoneNumber: string
  emailDomain: string
  subscriptionPlan: SubscriptionPlan
  status: CompanyStatus
  subscriptionStartedAt?: string
  subscriptionEndsAt?: string
  autoRenew?: boolean
  monthlyPrice?: number
  createdBy?: number
  documents?: {
    type: string
    tempFileName: string
    originalFileName: string
    expirationDate?: string
  }[]
}

// Filters for list
export type CompanyFilters = {
  name?: string
  dotNumber?: string
  status?: CompanyStatus | 'all'
}

// Document form value for creating/editing
export type CompanyDocumentFormValue = {
  id?: number
  type: string
  tempFileName?: string
  originalFileName?: string
  expirationDate?: string
  isNew?: boolean
}

// Form values for company sheet
export type CompanyFormValues = {
  fullName: string
  displayName: string
  dotNumber: string
  mcNumber: string
  address: string
  phoneNumber: string
  emailDomain: string
  status: CompanyStatus
  subscriptionPlan: SubscriptionPlan
  documents: CompanyDocumentFormValue[]
}

// Sheet props
export type CompanySheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyId?: number // Pass ID, sheet will fetch full data
  onSuccess?: () => void
}
