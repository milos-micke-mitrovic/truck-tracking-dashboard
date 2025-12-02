import type { Company, CompanyFormValues } from '../types'
import {
  DEFAULT_COMPANY_DOCUMENTS,
  DEFAULT_PLAN,
  DEFAULT_INDUSTRY,
  DEFAULT_CARGO_TYPE,
  DEFAULT_TIMEZONE,
  DEFAULT_STARTING_TIME,
  DEFAULT_VEHICLE_MOTION_SPEED_THRESHOLD,
  DEFAULT_CYCLE_RULE,
  DEFAULT_CONSTANT_EXCEPTIONS,
} from '../constants'

// Helper to get default form values
export function getCompanyFormDefaults(company?: Company | null): CompanyFormValues {
  if (company) {
    return {
      logo: company.logo,
      name: company.name,
      displayName: company.displayName,
      dotNumber: company.dotNumber,
      address: company.address,
      phone: company.phone,
      emailDomain: company.emailDomain,
      plan: company.plan,
      status: company.status,
      industry: company.industry,
      cargoType: company.cargoType,
      terminals: company.terminals.map((t) => ({ ...t })),
      vehicleMotionSpeedThreshold: company.configurations.eld.vehicleMotionSpeedThreshold,
      cycleRule: company.configurations.hos.cycleRule,
      constantExceptions: company.configurations.hos.constantExceptions,
      personalUse: company.configurations.hos.personalUse,
      yardMoves: company.configurations.hos.yardMoves,
      joinHosClocks: company.configurations.app.joinHosClocks,
      showTmsDashboard: company.configurations.app.showTmsDashboard,
      requirePasscodeToExitInspection: company.configurations.app.requirePasscodeToExitInspection,
      documents: company.documents.map((d) => ({ ...d })),
    }
  }

  return {
    logo: null,
    name: '',
    displayName: '',
    dotNumber: '',
    address: '',
    phone: '',
    emailDomain: '',
    plan: DEFAULT_PLAN,
    status: 'active',
    industry: DEFAULT_INDUSTRY,
    cargoType: DEFAULT_CARGO_TYPE,
    terminals: [
      {
        id: 'terminal-1',
        address: '',
        timezone: DEFAULT_TIMEZONE,
        startingTime: DEFAULT_STARTING_TIME,
      },
    ],
    vehicleMotionSpeedThreshold: DEFAULT_VEHICLE_MOTION_SPEED_THRESHOLD,
    cycleRule: DEFAULT_CYCLE_RULE,
    constantExceptions: DEFAULT_CONSTANT_EXCEPTIONS,
    personalUse: true,
    yardMoves: true,
    joinHosClocks: true,
    showTmsDashboard: true,
    requirePasscodeToExitInspection: true,
    documents: DEFAULT_COMPANY_DOCUMENTS.map((d) => ({ ...d })),
  }
}
