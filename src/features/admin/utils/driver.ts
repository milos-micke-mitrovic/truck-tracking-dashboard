import type { Driver, DriverDocument, DriverFormValues } from '../types'

// Default documents for new driver
export const defaultDriverDocuments: DriverDocument[] = [
  { id: 'doc-1', type: 'cdl', fileName: null, expirationDate: null },
  { id: 'doc-2', type: 'mvr', fileName: null, expirationDate: null },
  { id: 'doc-3', type: 'ssn_card', fileName: null, expirationDate: null },
  { id: 'doc-4', type: 'drug_test', fileName: null, expirationDate: null },
  { id: 'doc-5', type: 'application', fileName: null, expirationDate: null },
  { id: 'doc-6', type: 'medical_card', fileName: null, expirationDate: null },
  { id: 'doc-7', type: 'employment_verification', fileName: null, expirationDate: null },
  { id: 'doc-8', type: 'clearing_house', fileName: null, expirationDate: null },
]

// Helper to get default form values
export function getDriverFormDefaults(driver?: Driver | null): DriverFormValues {
  if (driver) {
    return {
      firstName: driver.firstName,
      lastName: driver.lastName,
      dateOfBirth: driver.dateOfBirth,
      status: driver.status,
      phone: driver.phone,
      email: driver.email,
      address: driver.address,
      comments: driver.comments,
      cycleRule: driver.configurations.hos.cycleRule,
      constantExceptions: driver.configurations.hos.constantExceptions,
      personalUse: driver.configurations.hos.personalUse,
      yardMoves: driver.configurations.hos.yardMoves,
      exempt: driver.configurations.hos.exempt,
      joinHosClocks: driver.configurations.app.joinHosClocks,
      showTmsDashboard: driver.configurations.app.showTmsDashboard,
      requirePasscodeToExitInspection: driver.configurations.app.requirePasscodeToExitInspection,
      compensationType: driver.accounting.compensationType || '',
      compensationRate: driver.accounting.compensationRate?.toString() || '',
      escrowDeposited: driver.accounting.escrowDeposited?.toString() || '',
      escrowMinimum: driver.accounting.escrowMinimum?.toString() || '',
      debt: driver.accounting.debt?.toString() || '',
      settlementMinimalAmount: driver.accounting.settlementMinimalAmount?.toString() || '',
      scheduledItems: driver.accounting.scheduledItems || '',
      documents: driver.documents.map((d) => ({ ...d })),
    }
  }

  return {
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    status: 'active',
    phone: '',
    email: '',
    address: '',
    comments: '',
    cycleRule: 'usa_70_8',
    constantExceptions: 'none',
    personalUse: false,
    yardMoves: false,
    exempt: false,
    joinHosClocks: true,
    showTmsDashboard: true,
    requirePasscodeToExitInspection: true,
    compensationType: '',
    compensationRate: '',
    escrowDeposited: '',
    escrowMinimum: '',
    debt: '',
    settlementMinimalAmount: '',
    scheduledItems: '',
    documents: defaultDriverDocuments.map((d) => ({ ...d })),
  }
}
