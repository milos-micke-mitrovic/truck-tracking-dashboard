import type { Status } from './common'

// Terminal
export type CompanyTerminal = {
  id: string
  address: string
  timezone: string
  startingTime: string // 24 Hour Period Starting Time (HH:mm:ss)
}

// Documents
export type CompanyDocumentType =
  | 'info_page'
  | 'mc_authority'
  | 'w9'
  | 'notice_of_assignment'
  | 'letter_of_release'
  | 'certificate_of_liability_insurance'
  | 'references'

export type CompanyDocument = {
  id: string
  type: CompanyDocumentType
  fileName: string | null
  expirationDate: string | null // ISO date string
}

// Configurations
export type CompanyEldConfig = {
  vehicleMotionSpeedThreshold: number // mph
}

export type CompanyHosConfig = {
  cycleRule: string
  constantExceptions: string
  personalUse: boolean
  yardMoves: boolean
}

export type CompanyAppConfig = {
  joinHosClocks: boolean
  showTmsDashboard: boolean
  requirePasscodeToExitInspection: boolean
}

export type CompanyAccountingConfig = {
  settlementTemplate: string
  weekPeriodStartDay: string
}

export type CompanyConfigurations = {
  eld: CompanyEldConfig
  hos: CompanyHosConfig
  app: CompanyAppConfig
  accounting: CompanyAccountingConfig
}

// Company entity
export type Industry =
  | 'transportation'
  | 'logistics'
  | 'manufacturing'
  | 'retail'
  | 'construction'
  | 'agriculture'

export type CargoType = 'property' | 'passengers' | 'hazmat' | 'household_goods'

export type Company = {
  id: string
  // General
  logo: string | null
  name: string
  displayName: string
  dotNumber: string
  mcNumber: string
  address: string
  phone: string
  emailDomain: string
  plan: 'basic' | 'premium' | 'enterprise'
  status: Status
  industry: Industry
  cargoType: CargoType
  // Related data
  terminals: CompanyTerminal[]
  configurations: CompanyConfigurations
  documents: CompanyDocument[]
  // Legacy/computed
  fleet: 'eminent' | 'established' | 'starter'
  terminalCount: number
}

// Filters
export type CompanyFilters = {
  name?: string
  dotNumber?: string
  status?: Status | 'all'
}

// Form values for company dialog
export type CompanyFormValues = {
  // General
  logo: string | null
  name: string
  displayName: string
  dotNumber: string
  mcNumber: string
  address: string
  phone: string
  emailDomain: string
  plan: string
  status: string
  industry: string
  cargoType: string
  // Terminals
  terminals: {
    id: string
    address: string
    timezone: string
    startingTime: string
  }[]
  // Configurations - ELD
  vehicleMotionSpeedThreshold: number
  // Configurations - HoS
  cycleRule: string
  constantExceptions: string
  personalUse: boolean
  yardMoves: boolean
  // Configurations - App
  joinHosClocks: boolean
  showTmsDashboard: boolean
  requirePasscodeToExitInspection: boolean
  // Configurations - Accounting
  settlementTemplate: string
  weekPeriodStartDay: string
  // Documents
  documents: {
    id: string
    type: string
    fileName: string | null
    expirationDate: string | null
  }[]
}

// Sheet props
export type CompanySheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  company?: Company | null
  onSuccess?: () => void
}
