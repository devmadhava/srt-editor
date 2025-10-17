import type { TimelineState } from "types/timeline";
import { createTimeFromSeconds } from "utils/timelineUtils";
import { create } from "zustand";

export const useTimelineStore = create<TimelineState>((set, get) => ({
    currentTime: 0,
    intervals: 1,
    zoom: 200,
    duration: 200,

    blocks: [],
    videoRef: null,
    isPlaying: false,

    focusedBlock: null,

    setCurrentTime: (time) => set({ currentTime: time }),
    addCurrentTime: (seconds) => set((state) => ({currentTime: state.currentTime + seconds})),
    setDuration: (duration) => set({ duration }),
    setTimemarkers: (interval) => {
        const zoom = 200 / interval;
        set({intervals: interval, zoom: zoom})
    }, 
    setVideoRef: (video) => {
        set({ videoRef: video });
    },
    setVideoRefTime: (seconds) => {
        if (!get().videoRef) return;
        get().videoRef?.seekTo(seconds);
    },
    setIsPlaying: (playing) => set({ isPlaying: playing }),
    // setBlocks: (blocks) => set({blocks: blocks}),
    setBlocks: (newBlocks) => 
        set((state) => {
            if (newBlocks.length === 0 ){
                return {blocks: []}
            }

            const { duration } = state;
            const lastBlock = newBlocks[newBlocks.length - 1];
            if (lastBlock.endSeconds > duration) {
                return {
                    blocks: newBlocks,
                    duration: lastBlock.endSeconds
                }
            }
            return {
                blocks: newBlocks
            }
        }),
    // addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
    setFocusedBlock: (id) => set({focusedBlock: id}),
    swapBlockIds: (index1, index2) => set((state) => {
        const newBlocks = state.blocks.map((block, i) => {
            if (i === index1) return { ...block, id: state.blocks[index2].id }; // Swap id with index2
            if (i === index2) return { ...block, id: state.blocks[index1].id }; // Swap id with index1
            return block; // Keep other elements unchanged
        });
        return { blocks: newBlocks };
    }),
    addBlock: (text = "New Subtitle") =>
        set((state) => {
            // const { blocks, duration } = state;
            const { blocks, duration, videoRef } = state;

            // Find the start time
            const lastBlock = blocks[blocks.length - 1];
            const nextStartSeconds = lastBlock ? lastBlock.endSeconds : 0;
            const nextEndSeconds = nextStartSeconds + 2;

            if (videoRef && nextEndSeconds > duration) {
                return state; // Do nothing if videoRef exists and block exceeds duration
            }

            // Format times (HH:MM:SS,MS)
            const nextStartTime = createTimeFromSeconds(nextStartSeconds);
            const nextEndTime = createTimeFromSeconds(nextEndSeconds);

            // Create new block
            const newBlock = {
                id: Date.now().toString(),
                startSeconds: nextStartSeconds,
                endSeconds: nextEndSeconds,
                startTime: nextStartTime,
                endTime: nextEndTime,
                text,
            };

            // Update state
            return {
                blocks: [...blocks, newBlock],
                duration: videoRef ? duration : Math.max(duration, nextEndSeconds), // Extend duration only if videoRef is null
            };
        }),
    insertBlock: (text = "New Block", startSeconds = null) => {
        set((state) => {
            const { blocks, duration, videoRef } = state;
            let newBlocks = [...blocks];
            const defaultDuration = 2;

            let newStart = startSeconds ?? (newBlocks.length > 0 ? newBlocks[newBlocks.length - 1].endSeconds : 0);
            let newEnd = newStart + defaultDuration;
            let insertIndex = newBlocks.length; // Default to last position

            // Case 1: No existing blocks
            if (newBlocks.length === 0) {
                return {
                    blocks: [
                        {
                            id: Date.now().toString(),
                            startSeconds: newStart,
                            endSeconds: newEnd,
                            startTime: createTimeFromSeconds(newStart),
                            endTime: createTimeFromSeconds(newEnd),
                            text,
                        },
                    ],
                    duration: videoRef ? duration : Math.max(duration, newEnd),
                };
            }

            // Case 2: Find correct position
            for (let i = 0; i < newBlocks.length; i++) {
                const block = newBlocks[i];

                // Insert before an existing block
                if (newStart < block.startSeconds) {
                    insertIndex = i;

                    // Check if there's space
                    if (i > 0) {
                        const prevBlock = newBlocks[i - 1];
                        if (newStart < prevBlock.endSeconds) {
                            newStart = prevBlock.endSeconds;
                            newEnd = newStart + defaultDuration;
                        }
                    }

                    // Trim if overlapping next block
                    if (newEnd > block.startSeconds) {
                        newEnd = block.startSeconds;
                    }
                    break;
                }

                // If it overlaps, move to next available position
                if (newStart >= block.startSeconds && newStart < block.endSeconds) {
                    newStart = block.endSeconds;
                    newEnd = newStart + defaultDuration;
                    insertIndex = i + 1;
                }
            }

            // Ensure it doesn't exceed duration
            if (videoRef && newEnd > duration) {
                return state; // Don't add if it exceeds video duration
            }

            // Create new block
            const newBlock = {
                id: Date.now().toString(),
                startSeconds: newStart,
                endSeconds: newEnd,
                startTime: createTimeFromSeconds(newStart),
                endTime: createTimeFromSeconds(newEnd),
                text,
            };

            // Insert block at calculated position
            newBlocks.splice(insertIndex, 0, newBlock);

            return {
                blocks: newBlocks,
                duration: videoRef ? duration : Math.max(duration, newEnd),
            };
        });
    },
    updateBlock: (id, newData) =>
        set((state) => ({
            blocks: state.blocks.map((block) =>
                block.id === id ? { ...block, ...newData } : block
            ),
        })),
    removeBlock: (id) =>
        set((state) => ({
            blocks: state.blocks.filter((block) => block.id !== id),
        })),
}));