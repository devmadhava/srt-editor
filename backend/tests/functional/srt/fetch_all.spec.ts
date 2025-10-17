import { test } from '@japa/runner'
import SubtitlesController from '#controllers/subtitles_controller'
import Srt from '#models/srt'

test.group('Srt fetch all', () => {
  test('forbidden without auth, returns list with auth', async ({ assert }) => {
    const controller = new SubtitlesController()

    const response: any = {
      forbidden(msg: any) { return { forbidden: true, msg } },
      ok(body: any) { return body },
    }

    // no auth
  const resNoAuth = await controller.fetchAll({ response, auth: {} } as any)
    assert.property(resNoAuth, 'forbidden')

    // with auth
    const auth: any = { user: { id: 7 } }
    const originalQuery = (Srt as any).query
    try {
      ;(Srt as any).query = () => ({ where() { return { select: async () => [{ id: 1, filename: 'a.srt', created_at: new Date(), updated_at: new Date() }] } } })

  const res: any = await controller.fetchAll({ response, auth } as any)
  assert.isArray(res)
  assert.equal(res[0].filename, 'a.srt')
    } finally {
      ;(Srt as any).query = originalQuery
    }
  })
})