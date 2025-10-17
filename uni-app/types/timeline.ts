import type ReactPlayer from "react-player";

export interface SubtitleBlock {
    id: string;
    // id: number;
    startSeconds: number;
    endSeconds: number;
    startTime: string;
    endTime: string;
    text: string;
}

export interface TimelineState {
    currentTime: number;
    
    intervals: number,
    zoom: number,
    duration: number;
    
    blocks: SubtitleBlock[];
    videoRef: null | ReactPlayer;
    isPlaying: boolean;

    focusedBlock: string | null,
    // focusedBlock: number | null,
    setFocusedBlock: (id: string) => void,

    setVideoRefTime: (seconds: number) => void;
        
    setCurrentTime: (time: number) => void;
    addCurrentTime: (seconds: number) => void;
    setDuration: (duration: number) => void;
    
    setTimemarkers: (interval: number) => void;
    
    setVideoRef: (video: ReactPlayer | null) => void;
    setIsPlaying: (playing: boolean) => void;
    setBlocks: (blocks: SubtitleBlock[]) => void;
    addBlock: (text?: string) => void;
    insertBlock: (text?: string, startSeconds?: null | number) => void;
    // addBlock: (block: SubtitleBlock) => void;
    swapBlockIds: (index1: number, index2: number) => void;

    updateBlock: (id: string, newData: Partial<SubtitleBlock>) => void;
    // updateBlock: (id: number, newData: Partial<SubtitleBlock>) => void;
    removeBlock: (id: string) => void;
    // removeBlock: (id: number) => void;
    // syncWithVideo: () => void;
}
