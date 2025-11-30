import { http, HttpResponse, delay } from 'msw'
import {
  companies,
  drivers,
  vehicles,
  trailers,
  users,
  eldDevices,
  portableDevices,
  gpsDevices,
  cameraDevices,
} from '../data'

const API_BASE = '/api'

// Helper to simulate network delay
const withDelay = async <T>(data: T): Promise<T> => {
  await delay(300)
  return data
}

// Helper for pagination
function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    data: items.slice(start, end),
    meta: {
      total: items.length,
      page,
      pageSize,
      totalPages: Math.ceil(items.length / pageSize),
    },
  }
}

export const adminHandlers = [
  // Companies
  http.get(`${API_BASE}/companies`, async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const name = url.searchParams.get('name')?.toLowerCase()
    const dotNumber = url.searchParams.get('dotNumber')
    const status = url.searchParams.get('status')

    let filtered = companies

    if (name) {
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(name))
    }
    if (dotNumber) {
      filtered = filtered.filter((c) => c.dotNumber.includes(dotNumber))
    }
    if (status && status !== 'all') {
      filtered = filtered.filter((c) => c.status === status)
    }

    return HttpResponse.json(
      await withDelay(paginate(filtered, page, pageSize))
    )
  }),

  http.get(`${API_BASE}/companies/:id`, async ({ params }) => {
    const company = companies.find((c) => c.id === params.id)
    if (!company) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(await withDelay(company))
  }),

  // Drivers
  http.get(`${API_BASE}/drivers`, async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const name = url.searchParams.get('name')?.toLowerCase()
    const phone = url.searchParams.get('phone')
    const status = url.searchParams.get('status')

    let filtered = drivers

    if (name) {
      filtered = filtered.filter((d) => d.name.toLowerCase().includes(name))
    }
    if (phone) {
      filtered = filtered.filter((d) => d.phone.includes(phone))
    }
    if (status && status !== 'all') {
      filtered = filtered.filter((d) => d.status === status)
    }

    return HttpResponse.json(
      await withDelay(paginate(filtered, page, pageSize))
    )
  }),

  http.get(`${API_BASE}/drivers/:id`, async ({ params }) => {
    const driver = drivers.find((d) => d.id === params.id)
    if (!driver) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(await withDelay(driver))
  }),

  // Vehicles
  http.get(`${API_BASE}/vehicles`, async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const unitNumber = url.searchParams.get('unitNumber')
    const status = url.searchParams.get('status')

    let filtered = vehicles

    if (unitNumber) {
      filtered = filtered.filter((v) =>
        v.unitNumber.toLowerCase().includes(unitNumber.toLowerCase())
      )
    }
    if (status && status !== 'all') {
      filtered = filtered.filter((v) => v.status === status)
    }

    return HttpResponse.json(
      await withDelay(paginate(filtered, page, pageSize))
    )
  }),

  http.get(`${API_BASE}/vehicles/:id`, async ({ params }) => {
    const vehicle = vehicles.find((v) => v.id === params.id)
    if (!vehicle) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(await withDelay(vehicle))
  }),

  // Trailers
  http.get(`${API_BASE}/trailers`, async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const trailerId = url.searchParams.get('trailerId')
    const ownership = url.searchParams.get('ownership')
    const status = url.searchParams.get('status')

    let filtered = trailers

    if (trailerId) {
      filtered = filtered.filter((t) =>
        t.trailerId.toLowerCase().includes(trailerId.toLowerCase())
      )
    }
    if (ownership && ownership !== 'all') {
      filtered = filtered.filter((t) => t.ownership === ownership)
    }
    if (status && status !== 'all') {
      filtered = filtered.filter((t) => t.status === status)
    }

    return HttpResponse.json(
      await withDelay(paginate(filtered, page, pageSize))
    )
  }),

  http.get(`${API_BASE}/trailers/:id`, async ({ params }) => {
    const trailer = trailers.find((t) => t.id === params.id)
    if (!trailer) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(await withDelay(trailer))
  }),

  // Users
  http.get(`${API_BASE}/users`, async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const name = url.searchParams.get('name')?.toLowerCase()
    const department = url.searchParams.get('department')
    const status = url.searchParams.get('status')

    let filtered = users

    if (name) {
      filtered = filtered.filter((u) => u.name.toLowerCase().includes(name))
    }
    if (department && department !== 'all') {
      filtered = filtered.filter((u) => u.department === department)
    }
    if (status && status !== 'all') {
      filtered = filtered.filter((u) => u.status === status)
    }

    return HttpResponse.json(
      await withDelay(paginate(filtered, page, pageSize))
    )
  }),

  http.get(`${API_BASE}/users/:id`, async ({ params }) => {
    const user = users.find((u) => u.id === params.id)
    if (!user) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(await withDelay(user))
  }),

  // ELD Devices
  http.get(`${API_BASE}/devices/eld`, async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const serialNumber = url.searchParams.get('serialNumber')
    const macAddress = url.searchParams.get('macAddress')

    let filtered = eldDevices

    if (serialNumber) {
      filtered = filtered.filter((d) => d.serialNumber.includes(serialNumber))
    }
    if (macAddress) {
      filtered = filtered.filter((d) => d.macAddress.includes(macAddress))
    }

    return HttpResponse.json(
      await withDelay(paginate(filtered, page, pageSize))
    )
  }),

  // Portable Devices
  http.get(`${API_BASE}/devices/portable`, async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const driverId = url.searchParams.get('driverId')

    let filtered = portableDevices

    if (driverId && driverId !== 'all') {
      filtered = filtered.filter((d) => d.driverId === driverId)
    }

    return HttpResponse.json(
      await withDelay(paginate(filtered, page, pageSize))
    )
  }),

  // GPS Devices
  http.get(`${API_BASE}/devices/gps`, async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const serialNumber = url.searchParams.get('serialNumber')

    let filtered = gpsDevices

    if (serialNumber) {
      filtered = filtered.filter((d) => d.serialNumber.includes(serialNumber))
    }

    return HttpResponse.json(
      await withDelay(paginate(filtered, page, pageSize))
    )
  }),

  // Camera Devices
  http.get(`${API_BASE}/devices/camera`, async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const vehicleId = url.searchParams.get('vehicleId')

    let filtered = cameraDevices

    if (vehicleId && vehicleId !== 'all') {
      filtered = filtered.filter((d) => d.vehicleId === vehicleId)
    }

    return HttpResponse.json(
      await withDelay(paginate(filtered, page, pageSize))
    )
  }),
]
