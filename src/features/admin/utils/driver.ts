import type { Driver, DriverFormValues } from '../types'
import {
  DEFAULT_DRIVER_DOCUMENTS,
  DEFAULT_CYCLE_RULE,
  DEFAULT_CONSTANT_EXCEPTIONS,
} from '../constants'

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
    cycleRule: DEFAULT_CYCLE_RULE,
    constantExceptions: DEFAULT_CONSTANT_EXCEPTIONS,
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
    documents: DEFAULT_DRIVER_DOCUMENTS.map((d) => ({ ...d })),
  }
}
