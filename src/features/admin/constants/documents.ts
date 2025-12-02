import type { CompanyDocument, DriverDocument } from '../types'

// Company document types
export const COMPANY_DOCUMENT_TYPES = [
  'info_page',
  'mc_authority',
  'w9',
  'notice_of_assignment',
  'letter_of_release',
  'certificate_of_liability_insurance',
  'references',
] as const

// Driver document types
export const DRIVER_DOCUMENT_TYPES = [
  'cdl',
  'mvr',
  'ssn_card',
  'drug_test',
  'application',
  'medical_card',
  'employment_verification',
  'clearing_house',
] as const

// Default company documents for new company form
export const DEFAULT_COMPANY_DOCUMENTS: CompanyDocument[] = [
  { id: 'doc-1', type: 'info_page', fileName: null, expirationDate: null },
  { id: 'doc-2', type: 'mc_authority', fileName: null, expirationDate: null },
  { id: 'doc-3', type: 'w9', fileName: null, expirationDate: null },
  { id: 'doc-4', type: 'notice_of_assignment', fileName: null, expirationDate: null },
  { id: 'doc-5', type: 'letter_of_release', fileName: null, expirationDate: null },
  { id: 'doc-6', type: 'certificate_of_liability_insurance', fileName: null, expirationDate: null },
  { id: 'doc-7', type: 'references', fileName: null, expirationDate: null },
]

// Default driver documents for new driver form
export const DEFAULT_DRIVER_DOCUMENTS: DriverDocument[] = [
  { id: 'doc-1', type: 'cdl', fileName: null, expirationDate: null },
  { id: 'doc-2', type: 'mvr', fileName: null, expirationDate: null },
  { id: 'doc-3', type: 'ssn_card', fileName: null, expirationDate: null },
  { id: 'doc-4', type: 'drug_test', fileName: null, expirationDate: null },
  { id: 'doc-5', type: 'application', fileName: null, expirationDate: null },
  { id: 'doc-6', type: 'medical_card', fileName: null, expirationDate: null },
  { id: 'doc-7', type: 'employment_verification', fileName: null, expirationDate: null },
  { id: 'doc-8', type: 'clearing_house', fileName: null, expirationDate: null },
]
