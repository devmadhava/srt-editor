export interface SubtitleEntry {
    id: string;
    startSeconds: number;
    endSeconds: number;
    startTime: string;
    endTime: string;
    text: string;
}

export interface FileUploadState {
    filename: string;
    subtitles: SubtitleEntry[];
    setSubtitles: (subtitles: SubtitleEntry[], filename?: string) => void;
    clearSubtitles: () => void;

    saveSubtitles: (filename: string, subtitles: SubtitleEntry[]) => void;
    downloadSubtitles: () => void;
}


export interface SRTEntry {
    id: string | number;
    filename: string;
    createdAt: string;
    updatedAt: string;
}