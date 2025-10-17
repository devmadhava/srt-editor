import { UploadIcon } from "lucide-react";
import { useCallback } from "react";
import { useSubtitleStore } from "store/subtitleStore";
import { parseJS, parseSRT } from "utils/srtParser";

export default function SRTUpload() {
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
        <div className="h-[250px] w-[250px] px-5 bg-base-100 flex flex-col items-center justify-center rounded-2xl shadow">
            <UploadIcon size={64} className="text-primary-content" />
            <input
                onChange={handleFileUpload}
                type="file"
                accept=".srt"
                className="file-input file-input-primary mt-5"
            />
        </div>
    );
}
