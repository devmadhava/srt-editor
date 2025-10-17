import { test } from '@japa/runner'
import SubtitlesController from '#controllers/subtitles_controller'
import Srt from '#models/srt'

test.group('Srt create', () => {
  test('returns conflict when duplicate exists, otherwise creates', async ({ assert }) => {
    const controller = new SubtitlesController()

    const payload = { filename: 'file.srt', srt: { extname: 'srt', moveToDisk: async () => {} } }

    // Stub request/response/auth
    const request: any = { validateUsing: async () => payload }
    const response: any = {
      created(body: any) { return body },
      conflict(body: any) { return body },
      internalServerError(body: any) { return body },
    }

    const auth: any = { user: { id: 5 } }

    const originalQuery = (Srt as any).query
    const originalCreate = (Srt as any).create
    const originalDrive = (global as any).drive

    try {
      // First simulate duplicate
      ;(Srt as any).query = () => ({ where() { return { where() { return { first: async () => ({ id: 1 }) } } } } })

      const dup = await controller.save({ request, response, auth } as any)
      assert.exists(dup)

      // Now simulate no duplicate and creation
      ;(Srt as any).query = () => ({ where() { return { where() { return { first: async () => null } } } } })
      ;(Srt as any).create = async (data: any) => ({ id: 10, ...data })

      ;(global as any).drive = { use() { return { getSignedUrl: async () => 'http://signed.url' } } }

      const created = await controller.save({ request, response, auth } as any)
      assert.exists(created)
    } finally {
      ;(Srt as any).query = originalQuery
      ;(Srt as any).create = originalCreate
      ;(global as any).drive = originalDrive
    }
  })
})