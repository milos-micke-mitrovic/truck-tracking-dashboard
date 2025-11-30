import type { HttpHandler } from 'msw'
import { adminHandlers } from './admin'
import { authHandlers } from './auth'

export const handlers: HttpHandler[] = [...adminHandlers, ...authHandlers]
