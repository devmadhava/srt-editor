import { test } from '@japa/runner'

test.group('Home index', () => {
  test('GET / returns hello world', async ({ client, assert }) => {
    const response = await client.get('/')

    response.assertStatus(200)
    assert.deepEqual(response.body(), { hello: 'world' })
  })
})