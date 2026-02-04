export type FacilityType = 'SHIPPER' | 'RECEIVER' | 'BOTH'

export type Facility = {
  id: string
  tenantId: number
  name: string
  facilityType: FacilityType
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  phone: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type FacilityShort = {
  id: string
  name: string
  facilityType: FacilityType
  city: string | null
  state: string | null
  address: string | null
}

export type FacilityCreateRequest = {
  tenantId: number
  name: string
  facilityType: FacilityType
  address?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  notes?: string
}

export type FacilityUpdateRequest = {
  name: string
  facilityType: FacilityType
  address?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  notes?: string
}
