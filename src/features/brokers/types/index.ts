export type BrokerSyncStatus = 'PENDING' | 'SYNCED' | 'FAILED'

export type Broker = {
  id: string
  tenantId: number
  mcNumber: string
  dotNumber: string | null
  legalName: string | null
  dbaName: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  phone: string | null
  authorityStatus: string | null
  lastSyncAt: string | null
  syncStatus: BrokerSyncStatus
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export type BrokerShort = {
  id: string
  mcNumber: string
  legalName: string | null
  dbaName: string | null
}

export type BrokerCreateRequest = {
  tenantId: number
  mcNumber: string
}
