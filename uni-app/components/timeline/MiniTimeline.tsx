import { useTimelineStore } from "store/myTimelineStore"
import { PlayButton } from "./PlayButton";

export default function MiniTimeline() {
    const { duration: time, currentTime, videoRef, setCurrentTime } = useTimelineStore();

    const handleTimeSliderChange = (e: any) => {
        const sec = parseInt(e.target.value);
        if (videoRef) {
            videoRef.seekTo(sec);
        }
        setCurrentTime(sec);
    }

    return (
        <div className="w-full h-full bg-primary flex justify-start items-center gap-2 px-4">
            <PlayButton />
            <input type="range" min={0} max={time} onChange={handleTimeSliderChange} value={currentTime} className="range range-primary-content range-xs flex-1" />
        </div>  
    )
}