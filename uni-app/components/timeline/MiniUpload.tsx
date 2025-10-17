import { UploadIcon } from "lucide-react";
import { useCallback } from "react";
import { useSubtitleStore } from "store/subtitleStore";
import { parseJS, parseSRT } from "utils/srtParser";

export default function MiniUpload() {
    const setSubtitles = useSubtitleStore((state) => state.setSubtitles);

    const handleFileUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            try {
                const filename = file.name;
                const text = await file.text();
                const subtitles = parseSRT(text);
                setSubtitles(subtitles, filename);
                console.log(subtitles);
                console.log(filename);
            } catch (error) {
                console.error("Error parsing SRT file:", error);
            }
        },
        [setSubtitles]
    );

    return (
        <>
            <input
                onChange={handleFileUpload}
                type="file"
                accept=".srt"
                className="file-input file-input-primary w-[250px]"
            />
        </>
    );
}
