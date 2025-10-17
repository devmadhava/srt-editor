import SrtParser2, { type Line } from "srt-parser-2";
import type { SubtitleEntry } from "types/srt";

export const parseSRT = (content: string): SubtitleEntry[] => {
    const parser = new SrtParser2();
    const parsed = parser.fromSrt(content);

    return parsed.map((entry) => ({
        id: entry.id,
        startSeconds: entry.startSeconds,
        endSeconds: entry.endSeconds,
        startTime: entry.startTime,
        endTime: entry.endTime,
        text: entry.text,
    }));
};

export const parseJS = (content: Line[]): string => {
    const parser = new SrtParser2();
    const parsed = parser.toSrt(content);
    return parsed;
};
