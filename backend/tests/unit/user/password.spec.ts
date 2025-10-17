import { test } from '@japa/runner'
import hash from '@adonisjs/core/services/hash'

test.group('User password', () => {
  test('hashes and verifies password', async ({ assert }) => {
    const plain = 'secret123'
    const hashed = await hash.use('scrypt').make(plain)

    assert.isString(hashed)
    assert.isTrue(await hash.use('scrypt').verify(hashed, plain))
  })
})