import type { Company, CompanyDocument, CompanyFormValues } from '../types'

// Default documents for new company
export const defaultCompanyDocuments: CompanyDocument[] = [
  { id: 'doc-1', type: 'info_page', fileName: null, expirationDate: null },
  { id: 'doc-2', type: 'mc_authority', fileName: null, expirationDate: null },
  { id: 'doc-3', type: 'w9', fileName: null, expirationDate: null },
  { id: 'doc-4', type: 'notice_of_assignment', fileName: null, expirationDate: null },
  { id: 'doc-5', type: 'letter_of_release', fileName: null, expirationDate: null },
  { id: 'doc-6', type: 'certificate_of_liability_insurance', fileName: null, expirationDate: null },
  { id: 'doc-7', type: 'references', fileName: null, expirationDate: null },
]

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
    plan: 'basic',
    status: 'active',
    industry: 'transportation',
    cargoType: 'property',
    terminals: [
      {
        id: 'terminal-1',
        address: '',
        timezone: 'America/Chicago',
        startingTime: '00:00:00',
      },
    ],
    vehicleMotionSpeedThreshold: 5,
    cycleRule: 'usa_70_8',
    constantExceptions: 'none',
    personalUse: true,
    yardMoves: true,
    joinHosClocks: true,
    showTmsDashboard: true,
    requirePasscodeToExitInspection: true,
    documents: defaultCompanyDocuments.map((d) => ({ ...d })),
  }
}
