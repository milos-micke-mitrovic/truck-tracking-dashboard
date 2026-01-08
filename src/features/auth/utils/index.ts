import type { User, JwtPayload } from '../types'

export function getUserDisplayName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim()
}

export function getUserInitials(user: User): string {
  const first = user.firstName?.charAt(0) || ''
  const last = user.lastName?.charAt(0) || ''
  return `${first}${last}`.toUpperCase()
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split('.')[1]
    const payload = atob(base64Payload)
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export function jwtPayloadToUser(payload: JwtPayload): User {
  return {
    id: parseInt(payload.sub, 10),
    firstName: payload.first_name,
    lastName: payload.last_name,
    email: payload.email,
    role: payload.role as User['role'],
    tenantId: payload.tenant_id,
    status: 'ACTIVE',
  }
}
