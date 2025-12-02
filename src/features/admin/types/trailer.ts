import type { Status } from './common'

export type TrailerOwnership = 'company' | 'contractor'

export type Trailer = {
  id: string
  companyId: string
  companyName: string
  trailerId: string
  type: string
  model: string
  vin: string
  licensePlate: string
  ownership: TrailerOwnership
  status: Status
}

export type TrailerFilters = {
  trailerId?: string
  ownership?: TrailerOwnership | 'all'
  status?: Status | 'all'
}
