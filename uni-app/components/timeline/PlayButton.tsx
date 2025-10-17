import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { useRef } from "react";
import { useTimelineStore } from "store/myTimelineStore";

export function PlayButton() {
    const { isPlaying, setIsPlaying, addCurrentTime, videoRef, duration: time, zoom } = useTimelineStore();
    const timeIntervalRef = useRef<null | NodeJS.Timeout>(null); // ✅ Use ref for interval
    const timeInPx = time * zoom;
    const timePerPixel = time / timeInPx;

    const handlePlayPause = () => {
        if (!videoRef) {
            isPlaying ? emulatePause() : emulatePlay();
        } else {
            console.log("normal play")
            isPlaying ? setIsPlaying(false) : setIsPlaying(true);
        }
    }

    const emulatePlay = () => {
        if (timeIntervalRef.current) return;
        const incrementInPixel = 1;
        const incrementInSeconds = incrementInPixel * timePerPixel;
        const incrementInMilliSeconds = incrementInSeconds * 1000;

        timeIntervalRef.current = setInterval(() => {
            addCurrentTime(incrementInSeconds)
        }, incrementInMilliSeconds);
        setIsPlaying(true);
    }

    const emulatePause = () => {
        if (timeIntervalRef.current) {
            clearInterval(timeIntervalRef.current);
            timeIntervalRef.current = null;
        } 
        setIsPlaying(false);
    }

    return (
        <button onClick={handlePlayPause} className="btn btn-square text-base-100">
            {isPlaying ? (
                <Pause className="text-primary-content" size={18} />
            ) : (
                <Play className="text-primary-content" size={18} />
            )}
        </button>
    )
}

export function BackwardByFive() {
    const { currentTime, isPlaying, setCurrentTime, setVideoRefTime } = useTimelineStore();
    const backwardByFive = () => {
        const timeToSet = currentTime - 5 <= 0 ? 0 : currentTime - 5;
        setCurrentTime(timeToSet);
        setVideoRefTime(timeToSet);
    };
    return (
        <button onClick={backwardByFive} className="btn btn-square text-base-100">
            <SkipBack className="text-primary-content" size={18} />
        </button>
    )
}


export function ForwardByFive() {
    const { duration : time, isPlaying, currentTime, setCurrentTime, setVideoRefTime } = useTimelineStore();
    const forwardByFive = () => {
        const timeToSet = currentTime + 5 >= time ? time : currentTime + 5;
        setCurrentTime(timeToSet);
        setVideoRefTime(timeToSet);
    };
    return (
        <button onClick={forwardByFive} className="btn btn-square text-base-100">
            <SkipForward className="text-primary-content" size={18} />
        </button>
    )
}