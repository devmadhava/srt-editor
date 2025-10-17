// @ts-nocheck
// Mock the srt-parser-2 dependency which is ESM-only and causes Jest to fail parsing it
jest.mock('srt-parser-2', () => {
  return jest.fn().mockImplementation(() => ({
    fromSrt: (content) => {
      // very small mock parser for tests
      return content
        .trim()
        .split('\n\n')
        .map((block, idx) => {
          const [idLine, timeLine, ...textLines] = block.split('\n');
          const [startTime, , endTime] = timeLine.split(' ');
          // convert simple times
          const toSeconds = (t) => {
            const [h, m, sms] = t.split(':');
            const [s, ms] = sms.split(',');
            return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + parseInt(ms) / 1000;
          };
          return {
            id: idLine,
            startTime,
            endTime,
            startSeconds: toSeconds(startTime),
            endSeconds: toSeconds(endTime),
            text: textLines.join('\n'),
          };
        });
    },
    toSrt: (lines) => {
      return lines
        .map((l, idx) => `${idx + 1}\n${l.startTime} --> ${l.endTime}\n${l.text}`)
        .join('\n\n');
    },
  }));
});

import { parseSRT, parseJS } from "../utils/srtParser";

const sampleSRT = `1
00:00:00,000 --> 00:00:02,000
Hello world

2
00:00:02,500 --> 00:00:04,000
Second line
`;

describe('srtParser', () => {
  it('parses SRT content into SubtitleEntry[]', () => {
    const parsed = parseSRT(sampleSRT);
    expect(parsed.length).toBe(2);
    expect(parsed[0]).toHaveProperty('id');
    expect(parsed[0]).toHaveProperty('startSeconds');
    expect(parsed[0]).toHaveProperty('text');
  });

  it('converts JS lines back to SRT', () => {
    const parsed = parseSRT(sampleSRT);
    const jsLines = parsed.map(p => ({
      id: p.id,
      startTime: p.startTime,
      endTime: p.endTime,
      text: p.text
    }));

    const back = parseJS(jsLines);
    expect(typeof back).toBe('string');
    expect(back.length).toBeGreaterThan(0);
  });
});
