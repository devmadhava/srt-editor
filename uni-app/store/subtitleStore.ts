import type { FileUploadState } from "types/srt";
import { create } from "zustand";

export const useSubtitleStore = create<FileUploadState>((set) => ({
    filename: 'filename.srt',
    subtitles: [],
    setSubtitles: (subtitles, filename = 'filename.srt') => set({ subtitles, filename}),
    clearSubtitles: () => set({ subtitles: [], filename: 'filename.srt' }),

    saveSubtitles: () => {

    },

    downloadSubtitles: () => {}
}));
