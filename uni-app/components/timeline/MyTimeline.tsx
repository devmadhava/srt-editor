import { closestCorners, DndContext, useDraggable, type DragEndEvent, type DragMoveEvent, type DragStartEvent } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";
import { Clock, GripVertical, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTimelineStore } from "store/myTimelineStore"
import { createTimeFromSeconds, formatSeconds, generateTimelineMarkers } from "utils/timelineUtils";

export default function MyTimeline() {
    const {duration: time, blocks, isPlaying, setIsPlaying, setDuration, currentTime, setCurrentTime, setBlocks, updateBlock, zoom, intervals} = useTimelineStore();
    const timeInPx = time * zoom;
    const timePerPixel = time / timeInPx;
    const timelineRef = useRef<HTMLDivElement | null>(null);
    const tickerRef = useRef<HTMLDivElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const animatedLeft = useRef<number>(0);

    useEffect(() => {
        const container = timelineRef.current;
        if (!container) return;

        const handleWheel = (event: WheelEvent) => {
            if (Math.abs(event.deltaX) > 0) return; // Skip if user is scrolling horizontally
            event.preventDefault(); // Prevent default vertical scroll
            container.scrollLeft += event.deltaY; // Convert vertical to horizontal
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            container.removeEventListener("wheel", handleWheel);
        };
    }, []);

    useEffect(() => {
        if (!tickerRef.current) return;
    
        const updateTickerPosition = () => {
            if (!tickerRef.current || !timelineRef.current) return;

            // Stop animation if currentTime is not changing
            const tickerPositionInPx = Math.floor(parseInt(tickerRef.current.style.left));
            const currentTimeInPx = Math.floor((currentTime / timePerPixel));
            if (tickerPositionInPx === currentTimeInPx) {
                cancelAnimationFrame(animationFrameRef.current!);
                animationFrameRef.current = null;
                return;
            }
    
            // Smooth transition
            // animatedLeft.current += (currentTime / timePerPixel - animatedLeft.current) * 0.2;
            animatedLeft.current += (currentTime / timePerPixel - animatedLeft.current);
            tickerRef.current.style.left = `${animatedLeft.current}px`;
    
            //Adjust Position if needed
            if (isPlaying || tickerPositionInPx !== currentTimeInPx) {
                adjustScrollPosition(); 
            }

            // Continue animation
            animationFrameRef.current = requestAnimationFrame(updateTickerPosition);
        };
    
        // Start animation if currentTime is changing
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(updateTickerPosition);
    
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [currentTime]);

    const handleDragEnd = (e: DragEndEvent) => {
        const {delta, over, active} = e;

        if (!active) return;
        if (over && over.id !== active.id) {
            const activeIndex = blocks.findIndex((block) => block.id === active.id);
            const overIndex = blocks.findIndex((block) => block.id === over.id);

            const updatedBlocks = arrayMove(blocks, activeIndex, overIndex);
            setBlocks(updatedBlocks);
        }

        const getBlock = blocks.filter((block) => block.id === active.id)[0];
        if (!getBlock) return;

        const blockWidth = (getBlock.endSeconds - getBlock.startSeconds) / timePerPixel;
        const currentLeft = getBlock.startSeconds / timePerPixel;
        let minX = 0;
        let maxX = timeInPx - blockWidth;

        blocks.forEach((block) => {
            if (block.id === active.id) return;
            const blockLeft = block.startSeconds / timePerPixel;
            const blockRight = block.endSeconds / timePerPixel;
    
            if (blockRight <= currentLeft) {
                minX = Math.max(minX, blockRight);
            }
    
            if (blockLeft >= currentLeft + blockWidth) {
                maxX = Math.min(maxX, blockLeft - blockWidth);
            }
        });

        const clampedDeltaX = Math.min(Math.max(delta.x + currentLeft, minX), maxX) - currentLeft;
        const deltaInTime = clampedDeltaX * timePerPixel;
        const nextStartSeconds = getBlock.startSeconds + deltaInTime;
        const nextEndSeconds = getBlock.endSeconds + deltaInTime;

        updateBlock(getBlock.id, {
            startSeconds: nextStartSeconds,
            endSeconds: nextEndSeconds,
            startTime: createTimeFromSeconds(nextStartSeconds),
            endTime: createTimeFromSeconds(nextEndSeconds),
        });
    
    }

    const handleTicker = (e: React.PointerEvent) => {
        if ((e.target as HTMLElement).closest(".draggable-block")) return; 

        const currentPlayState = isPlaying;
        currentPlayState && setIsPlaying(false);

        e.stopPropagation();
        if (!timelineRef.current) return;
        const currentTimeInPixels = e.clientX + timelineRef.current.scrollLeft;
        const currentTime = currentTimeInPixels * timePerPixel;
        setCurrentTime(currentTime);

        const startX = e.clientX;
        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaSeconds = deltaX * timePerPixel;
            const updatedTime = currentTime + deltaSeconds;
            setCurrentTime(updatedTime);         
        };


        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        setTimeout(() => {
            currentPlayState && setIsPlaying(true);
        }, 0);
    }

    const adjustScrollPosition = () => {
        if (!isPlaying) return;
        if (!tickerRef.current || !timelineRef.current) return;
        const tickerRect = tickerRef.current.getBoundingClientRect();
        const timelineRect = timelineRef.current.getBoundingClientRect();
        if (tickerRect.right > timelineRect.right || tickerRect.left < timelineRect.left) {
            timelineRef.current.scrollBy({behavior: 'smooth', left: tickerRect.left - 50,});
        }
    }

    return (
        <div className="w-full h-full relative">
            {/* <Controls /> */}
            <div
                ref={timelineRef} 
                className="w-full relative h-[110px] bg-base-100 rounded-lg overflow-x-scroll"
                onPointerDown={handleTicker}
            >
                {/* DND Context from DND Kit */}
                <DndContext
                    collisionDetection={closestCorners}
                    modifiers={[restrictToHorizontalAxis]}
                    onDragEnd={(e) => handleDragEnd(e)}
                >
                    <div className="flex relative">
                        {blocks.map((block, index) => (
                            // Visual representation of block
                            <DraggableBlock 
                                duration={time}
                                timeInPx={timeInPx} 
                                id={block.id} 
                                key={block.id} 
                                startSeconds={block.startSeconds} 
                                endSeconds={block.endSeconds} 
                                startTime={block.startTime}
                                endTime={block.endTime}
                                text={block.text}
                            />
                        ))}
                    </div>
                </DndContext>

                {/* Timeline ticker */}
                <span 
                    ref={tickerRef} 
                    className="w-[3px] h-full absolute bg-primary"
                >
                </span>
                {/* Timeline ruler */}
                <TimelineRuler timeInPx={timeInPx} />
            </div>
        </div>
    )
}

type TimelineRulerProps = {
    timeInPx: number,
}
const TimelineRuler = ({timeInPx}: TimelineRulerProps) => {
    const {duration: time, intervals} = useTimelineStore();
    const timeline = generateTimelineMarkers(time, intervals);
    const timePerPixel = time / timeInPx;
    const spacing = intervals / timePerPixel;

    return (
        <div className="absolute z-[11] top-0 bg-red-500 h-full">
            {timeline.map((time, index) => (
                <div key={index}>
                    {index !== 0 && (
                        <span
                            className="w-[1px] bg-primary-content absolute top-0 h-[25px]"
                            style={{ left: spacing * index + "px" }}
                        ></span>
                    )}

                    {Array.from({ length: 9 }).map((_, subIndex) => (
                        <span
                            key={`${index}-${subIndex}`}
                            className="absolute w-[1px] h-[10px] top-0 bg-primary-content opacity-70"
                            style={{
                                left:
                                    spacing * index +
                                    (subIndex + 1) * (spacing / 10) +
                                    "px",
                            }}
                        ></span>
                    ))}

                    <span
                        className="absolute text-primary-content text-[0.50rem] top-[10px] ml-[5px]"
                        style={{ left: spacing * index + "px" }}
                    >
                        {formatSeconds(time)}
                    </span>
                </div>
            ))}
            {/* Add the last big tick at the end */}
            <span
                className="w-[1px] bg-primary-content absolute top-0 h-[25px]"
                style={{ left: spacing * timeline.length + "px" }}
            ></span>

            <span
                className="absolute text-primary-content text-[0.50rem] top-[10px] ml-[5px]"
                style={{ left: spacing * timeline.length + "px" }}
            >
                {formatSeconds(timeline[timeline.length - 1] + (timeline[1] - timeline[0]))}
            </span>
        </div>
    )
}

const Controls = () => {
    const {currentTime, addBlock, insertBlock} = useTimelineStore();
    const handleAddBlock = () => {
        insertBlock("Please Add Text", currentTime);
    }

    return (
        <div className="w-full h-[50px] justify-between flex pb-4 items-center px-4">
            <button onClick={handleAddBlock} className="btn btn-square btn-primary">
                <Plus className="text-primary-content" size={18} />
            </button>
        </div>
    )
}

type DraggableBlockProps = {
    id: string;
    // id: number;
    startSeconds: number;
    endSeconds: number;
    // spacing: number;
    timeInPx: number;
    duration: number;
    startTime: string;
    endTime: string;
    text: string;
}
const DraggableBlock = ({id, startSeconds, endSeconds, timeInPx, duration: time, startTime, endTime, text}: DraggableBlockProps) => {
    const {blocks, removeBlock, updateBlock} = useTimelineStore();
    const [isResizing, setIsResizing] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const timePerPixel = time / timeInPx;
    const width = (endSeconds - startSeconds) / timePerPixel;
    const left = startSeconds / timePerPixel;
    
    let minX = 0;
    let maxX = timeInPx - width;
    blocks.forEach((block) => {
        if (block.id === id) return;

        const blockLeft = block.startSeconds / timePerPixel;
        const blockRight = block.endSeconds / timePerPixel;

        // 🚧 If a block is before the current one, update minX
        if (blockRight <= left) {
            minX = Math.max(minX, blockRight);
        }

        // 🚧 If a block is after the current one, update maxX
        if (blockLeft >= left + width) {
            maxX = Math.min(maxX, blockLeft - width);
        }
    });

    const clampedX = transform ? Math.min(Math.max(transform.x, minX - left), maxX - left) : 0;
    const displayStartTime = transform ? (createTimeFromSeconds((left + clampedX) * timePerPixel)) : createTimeFromSeconds(startSeconds);
    const displayEndTime = transform ? (createTimeFromSeconds((left + clampedX + width) * timePerPixel)) : createTimeFromSeconds(endSeconds);

    const style = {
        transform: transform ? `translateX(${clampedX}px)` : undefined,
        width: `${width}px`,
        left: `${left}px`,
        zIndex: transform ? '10' : 'auto',
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        removeBlock(id); 
    }

    // Resize Logic
    const handleResize = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsResizing(true);

        const startX = e.clientX;
        const initialEndSeconds = endSeconds;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaSeconds = deltaX * timePerPixel;

            let newEnd = Math.min(time, Math.max(initialEndSeconds + deltaSeconds, startSeconds + 1));

            // Prevent overlapping with the next block
            for (const block of blocks) {
                if (block.id !== id && block.startSeconds >= startSeconds) {
                    newEnd = Math.min(newEnd, block.startSeconds);
                }
            }

            updateBlock(id, { endSeconds: newEnd });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{...style, cursor: isResizing ? 'e-resize' : (transform ? 'grabbing' : 'grab')}}
            className="h-[75px] top-[25px] text-xs font-bold text-primary-content absolute flex justify-center items-center rounded draggable-block"
        >
            <div className="w-full h-full rounded bg-base-100 border border-primary-content relative flex justify-center items-center overflow-hidden">
                <div onPointerDown={handleResize} className="absolute w-fit h-full right-0 bg-primary-content flex items-center justify-center cursor-e-resize">
                    <GripVertical size={10} className="text-base-100"/>
                </div>
                <div className="w-full absolute top-0 flex justify-end pl-[2px] pr-[15px]">
                    <button onPointerDown={handleDelete} className="text-red-400 hover:text-red-600 cursor-pointer ml-1 text-[0.7rem] font-bold">
                        Delete
                    </button>
                </div>
                <p className="line-clamp-2">{text+"..."}</p>
            </div>
            {(transform || isResizing) && (
                <>
                    <div className="top-[50%] translate-y-[-50%] right-[calc(100%+5px)] z-30 absolute bg-primary-content w-[60px] h-[50%] flex items-center justify-center rounded-2xl">
                        <p className="text-[0.50rem] text-base-100">{displayStartTime}</p>
                    </div>

                    <div className="top-[50%] translate-y-[-50%] left-[calc(100%+5px)] z-30 absolute bg-primary-content w-[60px] h-[50%] flex items-center justify-center rounded-2xl">
                        <p className="text-[0.50rem] text-base-100">{displayEndTime}</p>
                    </div>
                </>
            )}
        </div>
    );
}