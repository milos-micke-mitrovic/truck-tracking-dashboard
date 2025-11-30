import type { User } from '@/features/auth/types'

export const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@skyhard.io',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Jane Dispatcher',
    email: 'dispatcher@skyhard.io',
    username: 'dispatcher',
    password: 'dispatch123',
    role: 'dispatcher',
  },
  {
    id: '3',
    name: 'Mike Driver',
    email: 'driver@skyhard.io',
    username: 'driver',
    password: 'driver123',
    role: 'driver',
  },
]
