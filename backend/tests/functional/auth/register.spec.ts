import { test } from '@japa/runner'
import AuthController from '#controllers/auth_controller'
import User from '#models/user'

test.group('Auth register', () => {
  test('creates a new user and returns token', async ({ assert }) => {
    const controller = new AuthController()

    // Stub validator result
    const payload = { email: 'test@example.com', password: 'password123', fullName: 'Test' }

    // Stub request/response
    const request: any = { validateUsing: async () => payload }
    const captured: any = {}
    const response: any = {
      ok(body: any) {
        captured.body = body
        return body
      },
    }

    // Stub User.create and accessTokens
    const originalCreate = User.create
    const originalAccessTokens = (User as any).accessTokens

    try {
      ;(User as any).create = async (data: any) => ({ id: 1, ...data, serialize() { return { id: 1, email: data.email, fullName: data.fullName } } })
      ;(User as any).accessTokens = { create: async (user: any) => ({ token: 'fake-token', userId: user.id }) }

  await controller.register({ request, response } as any)

      assert.exists(captured.body)
      assert.equal(captured.body.token.token, 'fake-token')
      assert.equal(captured.body.email, payload.email)
    } finally {
      ;(User as any).create = originalCreate
      ;(User as any).accessTokens = originalAccessTokens
    }
  })
})