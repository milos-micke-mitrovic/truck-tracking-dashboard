import { http, HttpResponse, delay } from 'msw'
import { mockUsers } from '../data'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(500)

    const body = (await request.json()) as {
      username: string
      password: string
    }

    const user = mockUsers.find(
      (u) => u.username === body.username && u.password === body.password
    )

    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user

    return HttpResponse.json({
      user: userWithoutPassword,
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
    })
  }),
]
