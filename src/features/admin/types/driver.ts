import type { Status, EnabledDisabled } from './common'

// Documents
export type DriverDocumentType =
  | 'cdl'
  | 'mvr'
  | 'ssn_card'
  | 'drug_test'
  | 'application'
  | 'medical_card'
  | 'employment_verification'
  | 'clearing_house'

export type DriverDocument = {
  id: string
  type: DriverDocumentType
  fileName: string | null
  expirationDate: string | null
}

// Configurations
export type DriverHosConfig = {
  cycleRule: string
  constantExceptions: string
  personalUse: boolean
  yardMoves: boolean
  exempt: boolean
}

export type DriverAppConfig = {
  joinHosClocks: boolean
  showTmsDashboard: boolean
  requirePasscodeToExitInspection: boolean
}

export type DriverConfigurations = {
  hos: DriverHosConfig
  app: DriverAppConfig
}

// Accounting
export type CompensationType =
  | 'per_mile'
  | 'per_hour'
  | 'percentage'
  | 'flat_rate'

export type DriverAccounting = {
  compensationType: CompensationType | null
  compensationRate: number | null
  escrowDeposited: number | null
  escrowMinimum: number | null
  debt: number | null
  settlementMinimalAmount: number | null
  scheduledItems: string | null
}

// License
export type DriverLicense = {
  country: string
  state: string
  number: string
}

// Assigned To
export type DriverAssignment = {
  homeTerminal: string
  suggestedVehicles: string[]
}

// Custom Attribute
export type DriverAttribute = {
  id: string
  attribute: string
  value: string
}

// Driver entity
export type Driver = {
  id: string
  companyId: string
  companyName: string
  // General
  firstName: string
  lastName: string
  dateOfBirth: string | null
  status: Status
  phone: string
  email: string
  address: string
  comments: string
  // Credentials
  username: string
  // License
  license: DriverLicense
  // Assigned To
  assignment: DriverAssignment
  // Tags & Attributes
  tags: string[]
  attributes: DriverAttribute[]
  // Configurations
  configurations: DriverConfigurations
  // Accounting
  accounting: DriverAccounting
  // Documents
  documents: DriverDocument[]
  // Legacy fields for table display
  name: string
  personalUse: EnabledDisabled
  yardMoves: EnabledDisabled
  exempt: EnabledDisabled
  cycle: EnabledDisabled
}

// Filters
export type DriverFilters = {
  name?: string
  phone?: string
  status?: Status | 'all'
}

// Form values for driver dialog
export type DriverFormValues = {
  // General - Personal Info
  firstName: string
  lastName: string
  dateOfBirth: string | null
  status: string
  phone: string
  email: string
  address: string
  comments: string
  // General - Credentials
  username: string
  newPassword: string
  // General - License
  licenseCountry: string
  licenseState: string
  licenseNumber: string
  // General - Assigned To
  homeTerminal: string
  suggestedVehicles: string[]
  // General - Tags & Attributes
  tags: string[]
  attributes: {
    id: string
    attribute: string
    value: string
  }[]
  // Configurations - HoS
  cycleRule: string
  constantExceptions: string
  personalUse: boolean
  yardMoves: boolean
  exempt: boolean
  // Configurations - App
  joinHosClocks: boolean
  showTmsDashboard: boolean
  requirePasscodeToExitInspection: boolean
  // Accounting
  compensationType: string
  compensationRate: string
  escrowDeposited: string
  escrowMinimum: string
  debt: string
  settlementMinimalAmount: string
  scheduledItems: string
  // Documents
  documents: {
    id: string
    type: string
    fileName: string | null
    expirationDate: string | null
  }[]
}

// Sheet props
export type DriverSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  driver?: Driver | null
  onSuccess?: () => void
}
