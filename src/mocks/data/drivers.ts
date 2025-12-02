import type { Driver, DriverConfigurations, DriverAccounting, DriverDocument } from '@/features/admin/types'

const defaultConfigurations: DriverConfigurations = {
  hos: {
    cycleRule: 'usa_70_8',
    constantExceptions: 'none',
    personalUse: false,
    yardMoves: false,
    exempt: false,
  },
  app: {
    joinHosClocks: true,
    showTmsDashboard: true,
    requirePasscodeToExitInspection: true,
  },
}

const defaultAccounting: DriverAccounting = {
  compensationType: null,
  compensationRate: null,
  escrowDeposited: null,
  escrowMinimum: null,
  debt: null,
  settlementMinimalAmount: null,
  scheduledItems: null,
}

const defaultDocuments: DriverDocument[] = [
  { id: 'doc-1', type: 'cdl', fileName: null, expirationDate: null },
  { id: 'doc-2', type: 'mvr', fileName: null, expirationDate: null },
  { id: 'doc-3', type: 'ssn_card', fileName: null, expirationDate: null },
  { id: 'doc-4', type: 'drug_test', fileName: null, expirationDate: null },
  { id: 'doc-5', type: 'application', fileName: null, expirationDate: null },
  { id: 'doc-6', type: 'medical_card', fileName: null, expirationDate: null },
  { id: 'doc-7', type: 'employment_verification', fileName: null, expirationDate: null },
  { id: 'doc-8', type: 'clearing_house', fileName: null, expirationDate: null },
]

function createDriver(
  id: string,
  companyId: string,
  companyName: string,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  options: Partial<{
    dateOfBirth: string
    address: string
    comments: string
    status: 'active' | 'inactive'
    personalUse: boolean
    yardMoves: boolean
    exempt: boolean
  }> = {}
): Driver {
  const name = `${firstName} ${lastName}`
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`

  return {
    id,
    companyId,
    companyName,
    firstName,
    lastName,
    name,
    username,
    dateOfBirth: options.dateOfBirth || null,
    status: options.status || 'active',
    phone,
    email,
    address: options.address || '',
    comments: options.comments || '',
    configurations: {
      ...defaultConfigurations,
      hos: {
        ...defaultConfigurations.hos,
        personalUse: options.personalUse || false,
        yardMoves: options.yardMoves || false,
        exempt: options.exempt || false,
      },
    },
    accounting: { ...defaultAccounting },
    documents: defaultDocuments.map((d) => ({ ...d })),
    // Legacy fields
    personalUse: options.personalUse ? 'enabled' : 'disabled',
    yardMoves: options.yardMoves ? 'enabled' : 'disabled',
    exempt: options.exempt ? 'enabled' : 'disabled',
    cycle: 'enabled',
  }
}

export const drivers: Driver[] = [
  createDriver('drv-1', 'comp-1', 'Atlas Freight Solutions', 'Marcus', 'Thompson', '(503) 228-4491', 'marcus.thompson@atlasfreight.com', {
    dateOfBirth: '1985-03-15',
    address: '1234 Oak St, Portland, OR 97201',
  }),
  createDriver('drv-2', 'comp-1', 'Atlas Freight Solutions', 'Derek', 'Williams', '(503) 447-8823', 'derek.williams@atlasfreight.com', {
    dateOfBirth: '1990-07-22',
    yardMoves: true,
  }),
  createDriver('drv-3', 'comp-2', 'Redwood Logistics Inc', 'Carlos', 'Rodriguez', '(916) 334-5567', 'carlos.rodriguez@redwoodlogistics.com', {
    dateOfBirth: '1982-11-08',
  }),
  createDriver('drv-4', 'comp-3', 'Horizon Transport LLC', 'James', 'Mitchell', '(901) 556-2234', 'james.mitchell@horizontransport.com', {
    dateOfBirth: '1988-05-30',
  }),
  createDriver('drv-5', 'comp-3', 'Horizon Transport LLC', 'Robert', 'Chen', '(901) 779-3345', 'robert.chen@horizontransport.com', {
    dateOfBirth: '1992-01-17',
  }),
  createDriver('drv-6', 'comp-4', 'Pinnacle Carriers', 'Anthony', 'Davis', '(804) 223-6678', 'anthony.davis@pinnaclecarriers.com', {
    dateOfBirth: '1979-09-25',
  }),
  createDriver('drv-7', 'comp-5', 'Summit Trucking Co', 'Kevin', 'Patterson', '(208) 445-8891', 'kevin.patterson@summittrucking.com', {
    dateOfBirth: '1986-12-03',
    yardMoves: true,
  }),
  createDriver('drv-8', 'comp-6', 'Keystone Haulers LLC', 'Brian', 'Foster', '(412) 337-2245', 'brian.foster@keystonehaulers.com', {
    dateOfBirth: '1991-04-19',
  }),
  createDriver('drv-9', 'comp-6', 'Keystone Haulers LLC', 'Steven', 'Garcia', '(412) 556-4478', 'steven.garcia@keystonehaulers.com', {
    dateOfBirth: '1984-08-11',
  }),
  createDriver('drv-10', 'comp-8', 'Crossroads Freight Inc', 'Michael', 'Brown', '(502) 228-9912', 'michael.brown@crossroadsfreight.com', {
    dateOfBirth: '1987-06-28',
  }),
  createDriver('drv-11', 'comp-10', 'Bluewater Logistics', 'David', 'Martinez', '(910) 334-7756', 'david.martinez@bluewaterlogistics.com', {
    dateOfBirth: '1993-02-14',
  }),
  createDriver('drv-12', 'comp-12', 'Metro Express Inc', 'Christopher', 'Lee', '(614) 447-2289', 'christopher.lee@metroexpress.com', {
    dateOfBirth: '1989-10-07',
    yardMoves: true,
  }),
  createDriver('drv-13', 'comp-12', 'Metro Express Inc', 'Jason', 'Taylor', '(614) 556-3378', 'jason.taylor@metroexpress.com', {
    dateOfBirth: '1981-07-23',
  }),
  createDriver('drv-14', 'comp-16', 'Riverdale Logistics', 'Ryan', 'Anderson', '(513) 779-4491', 'ryan.anderson@riverdalelogistics.com', {
    dateOfBirth: '1994-03-09',
  }),
  createDriver('drv-15', 'comp-20', 'Magnolia Freight Inc', 'William', 'Johnson', '(601) 228-5567', 'william.johnson@magnoliafreight.com', {
    dateOfBirth: '1983-11-16',
  }),
]
