import { test } from '@japa/runner'
import SubtitlesController from '#controllers/subtitles_controller'
import Srt from '#models/srt'

test.group('Srt fetch', () => {
  test('forbidden without auth, returns srt with auth', async ({ assert }) => {
    const controller = new SubtitlesController()

    const response: any = { forbidden: (m: any) => ({ forbidden: true, m }) }

  const resNoAuth = await controller.fetch({ params: { id: 1 }, response, auth: {} } as any)
    assert.property(resNoAuth, 'forbidden')

    // with auth
    const auth: any = { user: { id: 3 } }
    const originalFind = (Srt as any).findOrFail
    const originalDrive = (global as any).drive
    try {
      ;(Srt as any).findOrFail = async (id: any) => ({ id, userId: 3, storagePath: 'uploads/a.srt', filename: 'a.srt', createdAt: new Date() })
      ;(global as any).drive = { use() { return { getSignedUrl: async () => 'http://signed' } } }

      const res: any = await controller.fetch({ params: { id: 1 }, response, auth } as any)
      assert.equal(res.filename, 'a.srt')
      assert.exists(res.url)
    } finally {
      ;(Srt as any).findOrFail = originalFind
      ;(global as any).drive = originalDrive
    }
  })
})