// import { test } from '@japa/runner'
// import SubtitlesController from '#controllers/subtitles_controller'
// import Srt from '#models/srt'

// test.group('Srt delete', () => {
//   test('forbidden without auth and deletes when owner', async ({ assert }) => {
//     const controller = new SubtitlesController()

//     const response: any = { forbidden: (m: any) => ({ forbidden: true, m }) }

//     const resNoAuth = await controller.delete({ params: { id: 1 }, response } as any)
//     assert.property(resNoAuth, 'forbidden')

//     const auth: any = { user: { id: 8 } }
//     const originalFind = (Srt as any).findOrFail
//     const originalDrive = (global as any).drive
//     try {
//       ;(Srt as any).findOrFail = async (id: any) => ({ id, userId: 8, storagePath: 'uploads/a.srt', delete: async () => {} })
//       ;(global as any).drive = { use() { return { delete: async () => {} } } }

//       const res: any = await controller.delete({ params: { id: 1 }, response, auth } as any)
//       assert.equal(res.message, 'SRT deleted successfully')
//     } finally {
//       ;(Srt as any).findOrFail = originalFind
//       ;(global as any).drive = originalDrive
//     }
//   })
// })