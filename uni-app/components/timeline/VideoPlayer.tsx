import { ArrowRight, Send, UploadIcon, Volume, VolumeOff } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useTimelineStore } from "store/myTimelineStore";
import { PlayButton, BackwardByFive, ForwardByFive } from "./PlayButton";
// import ReactPlayer from 'react-player/youtube';
import ReactPlayer from "./ReactPlayer";
import { createTimeFromSeconds, formatSeconds } from "utils/timelineUtils";
import type { OnProgressProps } from "react-player/base";

export default function VideoPlayer() {
    const { isPlaying, videoRef, setVideoRef, setIsPlaying, blocks, currentTime, setCurrentTime, duration: time, setDuration: setTime } = useTimelineStore();
    const [videoplayer, setVideoplayer] = useState(false);
    const [url, setUrl] = useState<string>("");
    const [videoUrl, setVideoUrl] = useState<string | MediaStream>("");
    const [volume, setVolume] = useState<number>(1);

    const [showUrlField, setShowUrlField] = useState(false);
    const fileInputRef = useRef<null | HTMLInputElement>(null);
    
    useEffect(() => {
        setTimeout(() => {
            setVideoplayer(true);
        }, 2000);
    }, []);

    useEffect(() => {
        if (!videoRef) return;
        if (isPlaying) return;
        videoRef.seekTo(currentTime);
    }, [currentTime]);

    const handleFileUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            try {
                const filename = file.name;
                const blobUrl = URL.createObjectURL(file);
                setVideoUrl(blobUrl);
                console.log(filename);
            } catch (error) {
                console.error("Error parsing SRT file:", error);
            }
        },
        [videoRef, setVideoRef, fileInputRef]
    );

    const handleUploadClick = (e : React.MouseEvent) => {
        if (!fileInputRef.current) return;
        e.preventDefault();
        fileInputRef.current.click();
    };

    const handleUrlChange = () => {
        if (url.trim() === "") return;
        setVideoUrl(url);
    }

    const handleTimeSliderChange = (e: any) => {
        const sec = parseInt(e.target.value);
        if (videoRef) {
            videoRef.seekTo(sec);
        }
        setCurrentTime(sec);
    }

    const handleVolumeSliderChange = (e: any) => {
        const vol = parseInt(e.target.value) / 100;
        setVolume(vol);
    }

    const handleDurationLoad = (e: any) => {
        setTime(e);
    }

    const handleProgress = (e: OnProgressProps) => {
        setCurrentTime(e.playedSeconds);
    }

    const handleReady = (e: ReactPlayer) => {
        setVideoRef(e);
    }

    return (
        <div className="flex flex-col w-full h-full relative rounded bg-base-100 overflow-hidden">
            <div className="flex justify-end h-[60px] w-full items-center">
                {videoplayer ? (
                    <ul className="menu menu-horizontal lg:menu-horizontal bg-base-100 rounded-box text-primary-content flex items-center justify-center">
                        <li>
                            <a onClick={() => setShowUrlField(!showUrlField)}>
                                {showUrlField ? ('Hide URL') : ('Enter URL')}
                            </a>
                        </li>
                        {showUrlField ? (
                            <li className="relative mx-2">
                                <input value={url} onChange={(e) => setUrl(e.target.value)} type="text" placeholder="https://www.youtube.com/_link_" className="input input-primary pr-[50px]" />
                                <button 
                                    onClick={handleUrlChange}
                                    className={url.trim() === "" ?  
                                        "absolute btn btn-disabled right-0 h-full bg-primary w-[50px] flex items-center justify-center" :  
                                        "absolute btn btn-primary right-0 h-full bg-primary w-[50px] flex items-center justify-center"
                                    }
                                >
                                    <ArrowRight className="text-primary-content" size={18} />
                                </button>
                            </li>
                        ) : (
                            <li>
                                <a onClick={handleUploadClick}>Upload Video</a>
                                <input 
                                    onChange={handleFileUpload}
                                    ref={fileInputRef}
                                    accept=".mp4, .webm"
                                    type="file" 
                                    className="hidden file-input file-input-primary w-[250px]"
                                />
                            </li>
                        )}
                    </ul>
                ) : (<p className="text-base text-primary-content mx-5">Loading...</p>)}
            </div>

           <div className="bg-black flex aspect-video relative justify-center items-stretch">
                {videoplayer ? (
                    <ReactPlayer
                        url={videoUrl}
                        volume={volume}
                        playing={isPlaying}
                        onDuration={handleDurationLoad}
                        controls={false}
                        onProgress={handleProgress}
                        onReady={handleReady}
                        width={'100%'}
                        height={'100%'}
                        style={{backgroundColor: 'black'}}
                    />
                ) : (
                    <LoadingIndicator />
                )}

                <OverlaySubtitle />
           </div>

            <div className="flex flex-col w-full h-[120px] py-2">
                <div className="flex w-full h-[50%] gap-5 px-5 items-center justify-center">
                    <input type="range" min={0} max={time} onChange={handleTimeSliderChange} value={currentTime} className="range range-primary range-xs w-[80%]" />
                    <div className="flex w-[20%] gap-2">
                        {volume === 0 ? (
                            <VolumeOff className="text-primary-content" size={18} />
                        ) : (
                            <Volume className="text-primary-content" size={18} />
                        )}
                        <input type="range" min={0} max={100} onChange={handleVolumeSliderChange} value={volume * 100} className="range range-primary range-xs w-[80%]" />
                    </div>
                </div>

                <PlayerControls />
            </div>
        </div>
    )
}


const OverlaySubtitle = () => {
    const { blocks, currentTime, updateBlock } = useTimelineStore();
    const activeSubtitles = blocks.filter(
        (block) => currentTime >= block.startSeconds && currentTime <= block.endSeconds
    );
    const handleChange = (e: any, id: string) => {
        updateBlock(id, {text: e.target.value});
    }

    if (!activeSubtitles || activeSubtitles.length === 0) return null;
    return (
        <>
            {activeSubtitles.map((block) => (
                <div key={block.id} className="w-full h-auto absolute bottom-0 left-[50%] translate-x-[-50%] px-5 py-2" style={{backgroundColor: 'rgb(0, 0, 0, 0.7)'}}>
                    <pre>
                        <p className="text-sm text-center text-white">{block.text}</p>
                    </pre>
                    {/* <p className="text-sm text-center text-white">{block.text}</p> */}
                    {/* <textarea onChange={(e) => handleChange(e, block.id)} className="text-sm text-center text-white border-0 w-[100%] h-full" value={block.text}/> */}
                </div>
            ))}
        </>
    )
}

const LoadingIndicator = () => {
    return (
        <div className="flex justify-center items-center w-full h-full">
            <span className="loading loading-ring loading-xs text-primary"></span>
            <span className="loading loading-ring loading-sm text-primary"></span>
            <span className="loading loading-ring loading-md text-primary"></span>
            <span className="loading loading-ring loading-lg text-primary"></span>
            <span className="loading loading-ring loading-xl text-primary"></span>
        </div>
    );
}

const PlayerControls = () => {
    const { duration: time, currentTime } = useTimelineStore();
    return (
        <div className="flex w-full items-center h-[50%] justify-center px-5">
            <p className="text-xs text-primary-content w-[20%] flex justify-start">{createTimeFromSeconds(currentTime)}</p>
            <ul className="w-[60%] menu menu-horizontal lg:menu-horizontal gap-4 rounded-box flex items-center justify-center">
                <li><BackwardByFive /></li>
                <li><PlayButton /></li>
                <li><ForwardByFive /></li>
            </ul>
            <p className="text-xs text-primary-content w-[20%] flex justify-end">{createTimeFromSeconds(time)}</p>
        </div>    
    )
}