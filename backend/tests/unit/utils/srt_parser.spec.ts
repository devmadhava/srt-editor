import { test } from '@japa/runner'
import { parseSrt } from '../../../app/utils/srt_parser.js'

test.group('Utils srt parser', () => {
  test('parses a minimal srt content', async ({ assert }) => {
    const sample = `1\n00:00:00,000 --> 00:00:02,000\nHello world\n\n2\n00:00:02,500 --> 00:00:04,000\nSecond line`

    const parsed = parseSrt(sample)

    assert.lengthOf(parsed, 2)
    assert.equal(parsed[0].index, 1)
    assert.equal(parsed[0].start, '00:00:00,000')
    assert.equal(parsed[0].end, '00:00:02,000')
    assert.equal(parsed[0].text, 'Hello world')
    assert.equal(parsed[1].index, 2)
  })
})