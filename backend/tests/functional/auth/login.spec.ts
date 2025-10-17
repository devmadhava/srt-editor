import { test } from '@japa/runner'
import AuthController from '#controllers/auth_controller'
import User from '#models/user'

test.group('Auth login', () => {
  test('verifies credentials and returns token', async ({ assert }) => {
    const controller = new AuthController()

    const payload = { email: 'a@b.com', password: 'password123' }
    const request: any = { validateUsing: async () => payload }
    const captured: any = {}
    const response: any = {
      ok(body: any) {
        captured.body = body
        return body
      },
      unauthorized(msg: string) {
        captured.unauthorized = msg
        return { status: 'unauthorized' }
      },
    }

    const originalVerify = (User as any).verifyCredentials
    const originalAccessTokens = (User as any).accessTokens

    try {
  ;(User as any).verifyCredentials = async (email: string, _p: string) => ({ id: 2, email, authType: 'email', serialize() { return { id: 2, email } } })
      ;(User as any).accessTokens = { create: async (user: any) => ({ token: 'login-token', userId: user.id }) }

      await controller.login({ request, response } as any)

      assert.equal(captured.body.token.token, 'login-token')
      assert.equal(captured.body.email, payload.email)
    } finally {
      ;(User as any).verifyCredentials = originalVerify
      ;(User as any).accessTokens = originalAccessTokens
    }
  })
})