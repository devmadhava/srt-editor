export interface SubtitleLine {
  index: number
  start: string
  end: string
  text: string
}

/**
 * Very small SRT parser used only for unit tests.
 * It parses a minimal SRT snippet and returns array of lines.
 */
export function parseSrt(srt: string): SubtitleLine[] {
  const parts = srt
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  const out: SubtitleLine[] = []

  for (const part of parts) {
    const lines = part.split(/\r?\n/)
    const index = Number(lines[0])
    const [times, ...textLines] = lines.slice(1)
    const [start, end] = times.split(' --> ').map((s) => s.trim())
    out.push({ index, start, end, text: textLines.join('\n') })
  }

  return out
}
