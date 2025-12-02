import type { Driver, DriverFormValues } from '../types'
import {
  DEFAULT_DRIVER_DOCUMENTS,
  DEFAULT_CYCLE_RULE,
  DEFAULT_CONSTANT_EXCEPTIONS,
  DEFAULT_COUNTRY,
} from '../constants'

// Helper to get default form values
export function getDriverFormDefaults(driver?: Driver | null): DriverFormValues {
  if (driver) {
    return {
      // Personal Info
      firstName: driver.firstName,
      lastName: driver.lastName,
      dateOfBirth: driver.dateOfBirth,
      status: driver.status,
      phone: driver.phone,
      email: driver.email,
      address: driver.address,
      comments: driver.comments,
      // Credentials
      username: driver.username,
      newPassword: '',
      // License
      licenseCountry: driver.license.country,
      licenseState: driver.license.state,
      licenseNumber: driver.license.number,
      // Assigned To
      homeTerminal: driver.assignment.homeTerminal,
      suggestedVehicles: driver.assignment.suggestedVehicles,
      // Tags & Attributes
      tags: driver.tags,
      attributes: driver.attributes.map((a) => ({ ...a })),
      // Configurations - HoS
      cycleRule: driver.configurations.hos.cycleRule,
      constantExceptions: driver.configurations.hos.constantExceptions,
      personalUse: driver.configurations.hos.personalUse,
      yardMoves: driver.configurations.hos.yardMoves,
      exempt: driver.configurations.hos.exempt,
      // Configurations - App
      joinHosClocks: driver.configurations.app.joinHosClocks,
      showTmsDashboard: driver.configurations.app.showTmsDashboard,
      requirePasscodeToExitInspection: driver.configurations.app.requirePasscodeToExitInspection,
      // Accounting
      compensationType: driver.accounting.compensationType || '',
      compensationRate: driver.accounting.compensationRate?.toString() || '',
      escrowDeposited: driver.accounting.escrowDeposited?.toString() || '',
      escrowMinimum: driver.accounting.escrowMinimum?.toString() || '',
      debt: driver.accounting.debt?.toString() || '',
      settlementMinimalAmount: driver.accounting.settlementMinimalAmount?.toString() || '',
      scheduledItems: driver.accounting.scheduledItems || '',
      // Documents
      documents: driver.documents.map((d) => ({ ...d })),
    }
  }

  return {
    // Personal Info
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    status: 'active',
    phone: '',
    email: '',
    address: '',
    comments: '',
    // Credentials
    username: '',
    newPassword: '',
    // License
    licenseCountry: DEFAULT_COUNTRY,
    licenseState: '',
    licenseNumber: '',
    // Assigned To
    homeTerminal: '',
    suggestedVehicles: [],
    // Tags & Attributes
    tags: [],
    attributes: [{ id: 'attr-1', attribute: '', value: '' }],
    // Configurations - HoS
    cycleRule: DEFAULT_CYCLE_RULE,
    constantExceptions: DEFAULT_CONSTANT_EXCEPTIONS,
    personalUse: false,
    yardMoves: false,
    exempt: false,
    // Configurations - App
    joinHosClocks: true,
    showTmsDashboard: true,
    requirePasscodeToExitInspection: true,
    // Accounting
    compensationType: '',
    compensationRate: '',
    escrowDeposited: '',
    escrowMinimum: '',
    debt: '',
    settlementMinimalAmount: '',
    scheduledItems: '',
    // Documents
    documents: DEFAULT_DRIVER_DOCUMENTS.map((d) => ({ ...d })),
  }
}
