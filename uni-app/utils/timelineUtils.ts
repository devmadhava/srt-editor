export const checkCollision = (
    startTime: number,
    endTime: number,
    blocks: { startTime: number; endTime: number; id: string }[],
    excludeId?: string
): boolean => {
    return blocks.some(
        (block) =>
            block.id !== excludeId &&
            ((startTime >= block.startTime && startTime < block.endTime) ||
                (endTime > block.startTime && endTime <= block.endTime) ||
                (startTime <= block.startTime && endTime >= block.endTime))
    );
};

export const snapToGrid = (time: number, gridSize: number = 1): number => {
    return Math.round(time / gridSize) * gridSize;
};

export const getValidTimeRange = (
    proposedStart: number,
    proposedEnd: number,
    blocks: { startTime: number; endTime: number; id: string }[],
    activeBlockId: string,
    duration: number
): { startTime: number; endTime: number } => {
    const otherBlocks = blocks.filter((b) => b.id !== activeBlockId);

    // Find nearest valid position
    let startTime = Math.max(0, proposedStart);
    let endTime = Math.min(duration, proposedEnd);

    // Snap to grid
    startTime = snapToGrid(startTime);
    endTime = snapToGrid(endTime);

    // Ensure minimum block size
    const minBlockSize = 1; // 1 second minimum
    if (endTime - startTime < minBlockSize) {
        endTime = startTime + minBlockSize;
    }

    // Check for collisions and adjust
    const leftBlocks = otherBlocks
        .filter((b) => b.endTime <= startTime)
        .sort((a, b) => b.endTime - a.endTime);

    const rightBlocks = otherBlocks
        .filter((b) => b.startTime >= endTime)
        .sort((a, b) => a.startTime - b.startTime);

    if (checkCollision(startTime, endTime, otherBlocks)) {
        const leftSpace =
            leftBlocks.length > 0
                ? {
                      start: leftBlocks[0].endTime,
                      end: rightBlocks[0]?.startTime ?? duration,
                  }
                : { start: 0, end: rightBlocks[0]?.startTime ?? duration };

        if (leftSpace.end - leftSpace.start >= minBlockSize) {
            startTime = leftSpace.start;
            endTime = Math.min(
                leftSpace.start + (proposedEnd - proposedStart),
                leftSpace.end
            );
        }
    }

    return { startTime, endTime };
};



// Time line
// export const timeToSeconds = (timeString: string): number => {
//     if (!timeString) return 0;
//     const timeRegex = /^(\d+):[0-5]\d:[0-5]\d,\d{3}$/;

//     if (!timeRegex.test(timeString)) {
//         console.error("Invalid time format. Use HH:MM:SS,mmm");
//         return 0; // Or throw an error
//     }

//     const parts = timeString.split(":");
//     if (parts.length !== 3) {
//         console.error("Invalid time format. Use HH:MM:SS,mmm");
//         return 0; // Or throw an error
//     }

//     const [hours, minutes, secondsAndMilliseconds] = parts;
//     const [seconds, milliseconds] = secondsAndMilliseconds.split(",");

//     const totalSeconds =
//         parseInt(hours, 10) * 3600 +
//         parseInt(minutes, 10) * 60 +
//         parseInt(seconds, 10) +
//         parseFloat(milliseconds) / 1000;

//     return totalSeconds;
// };


export const validateTime = (value: string) => {
    const timeRegex = /^(\d+):([0-5]\d):([0-5]\d),(\d+)(?:\.(\d+))?$/;
    return timeRegex.test(value);
};

export const timeToSeconds = (timeString: string): number => {
    if (!timeString) return 0;
    
    const timeRegex = /^(\d+):([0-5]\d):([0-5]\d),(\d+)(?:\.(\d+))?$/;

    const match = timeString.match(timeRegex);
    if (!match) {
        console.error("Invalid time format. Use HH:MM:SS,mmm or HH:MM:SS,mmm.ssssss");
        return 0; // Or throw an error
    }

    const [, hours, minutes, seconds, milliseconds, extraMicroseconds] = match;
    
    let totalSeconds =
        parseInt(hours, 10) * 3600 +
        parseInt(minutes, 10) * 60 +
        parseInt(seconds, 10) +
        parseInt(milliseconds, 10) / 1000;

    if (extraMicroseconds) {
        totalSeconds += parseInt(extraMicroseconds, 10) / Math.pow(10, extraMicroseconds.length + 3);
    }

    return totalSeconds;
};


export const formatSeconds = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


export const createTimeFromSeconds = (seconds: number) => {
    const time = new Date(seconds * 1000)
        .toISOString()
        .substring(11, 23)
        .replace(".", ",");
    return time;
}


export const generateTimelineMarkers = (totalDuration: number, interval: number) => {
    const markers = [];
    for (let i = 0; i < totalDuration; i += interval) {
        markers.push(i); // Store seconds
    }
    return markers;
};


