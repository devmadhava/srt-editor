import type { SubtitleBlock } from "types/timeline";
import { parseJS } from "utils/srtParser";
import axios from "axios";
import type { SRTEntry } from "types/srt";
import { API_URL } from "constant/constant";

const API_BASE = `${API_URL}/srt`;

export const handleSaveSubtitles = async (
    blocks: SubtitleBlock[],
    filename: string
) => {
    try {
        // Generate SRT string
        const srtContent = parseJS(blocks);

        // Ensure filename ends with .srt
        const safeFilename = filename.endsWith(".srt")
            ? filename
            : `${filename}.srt`;

            console.log(safeFilename)

        // Create a File from string
        const file = new File([srtContent], safeFilename, {
            type: "text/plain",
        });

        // Prepare FormData
        const formData = new FormData();
        formData.append("filename", safeFilename);
        formData.append("srt", file);

        // POST to Adonis endpoint using Axios
        const response = await axios.post(
            // "http://localhost:3333/srt",
            `${API_BASE}`,
            formData,
            {
                // Headers for multipart are automatically set by Axios
                // Auth headers are pre-configured in your Axios instance
            }
        );
        
        console.log("Request headers sent:", response.config.headers);

        console.log("✅ Saved successfully:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error saving subtitles:", error.response?.data || error);
        throw error;
    }
};


export const fetchFiles = async () => {
    try {
        const res = await axios.get<SRTEntry[]>(
            // "http://localhost:3333/srt/all"
            `${API_BASE}/all`
        );
        console.log("Request headers sent:", res.config.headers);
        return res.data;
    } catch (error: any) {
        console.error("Fetch files error:", error.response?.data || error);
        console.log("Request headers attempted:", error.config?.headers);
        throw error;
    }
};
