import { test } from '@japa/runner'
import SubtitlesController from '#controllers/subtitles_controller'
import Srt from '#models/srt'

test.group('Srt update', () => {
  test('forbidden without auth and updates when owner', async ({ assert }) => {
    const controller = new SubtitlesController()

    const payload = { filename: 'new.srt', srt: { extname: 'srt', moveToDisk: async () => {} } }
    const request: any = { validateUsing: async () => payload }
    const response: any = { forbidden: (m: any) => ({ forbidden: true, m }) }

    // no auth
  const resNoAuth = await controller.update({ request, response, params: { id: 1 }, auth: {} } as any)
    assert.property(resNoAuth, 'forbidden')

    // with auth
    const auth: any = { user: { id: 4 } }
    const originalFind = (Srt as any).findOrFail
    const originalDrive = (global as any).drive
    try {
      ;(Srt as any).findOrFail = async (id: any) => ({ id, userId: 4, storagePath: 'uploads/old.srt', filename: 'old.srt', merge(obj: any) { Object.assign(this, obj) }, save: async () => {} })
      ;(global as any).drive = { use() { return { delete: async () => {}, getSignedUrl: async () => 'http://signed.new' } } }

      const res: any = await controller.update({ request, response, auth, params: { id: 1 } } as any)
      assert.equal(res.srt.filename, 'new.srt')
      assert.exists(res.url)
    } finally {
      ;(Srt as any).findOrFail = originalFind
      ;(global as any).drive = originalDrive
    }
  })
})