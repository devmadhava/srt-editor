import type { SubtitleBlock } from "types/timeline";
import { parseJS } from "utils/srtParser";

export const handleDownloadSubtitles = async (blocks: SubtitleBlock[], filename: string,) => {
    filename = "filename.srt";
    try {
        const srtContent = parseJS(blocks);
        const blob = new Blob([srtContent], {
            type: "text/plain;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error coding SRT file:", error);
    }
};
