// import { useTimelineStore } from "store/myTimelineStore";
// import MiniUpload from "./MiniUpload";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { parseJS, parseSRT } from "utils/srtParser";
// import type { SubtitleBlock } from "types/timeline";
// import { CheckCircle, Circle, Plus } from "lucide-react";
// import {
//     createTimeFromSeconds,
//     timeToSeconds,
//     validateTime,
// } from "utils/timelineUtils";
// import { handleDownloadSubtitles } from "api/download";
// import { useAuth } from "context/AuthProvider";
// import { handleSaveSubtitles } from "api/save";

// export default function SubtitleList() {
//     const {
//         blocks,
//         updateBlock,
//         currentTime,
//         setBlocks,
//         removeBlock,
//         insertBlock,
//     } = useTimelineStore();
//     const { user } = useAuth();
//     const fileInputRef = useRef<null | HTMLInputElement>(null);
//     const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
//     const [isSaving, setIsSaving] = useState(false);
//     const [filename, setFilename] = useState<string>("");
//     const linkref = useRef<HTMLAnchorElement>(null);

//     const handleUploadClick = (e: React.MouseEvent) => {
//         if (!fileInputRef.current) return;
//         e.preventDefault();
//         fileInputRef.current.click();
//     };

//     const handleFileUpload = useCallback(
//         async (event: React.ChangeEvent<HTMLInputElement>) => {
//             const file = event.target.files?.[0];
//             if (!file) return;

//             try {
//                 const originalName = file.name;
//                 const newName = originalName.replace(/\.[^/.]+$/, "");
//                 const text = await file.text();
//                 const subtitles = parseSRT(text);
//                 setBlocks(subtitles);
//                 setFilename(newName);
//             } catch (error) {
//                 console.error("Error parsing SRT file:", error);
//             }
//         },
//         [blocks]
//     );

//     const handleClearSubtitles = () => {
//         setBlocks([]);
//     };

//     const handleAddBlock = () => {
//         insertBlock("Please Add Text", currentTime);
//     };

//     const handleDeleteSelected = () => {
//         if (selectedBlockIds.length === 0) return;
//         const updatedBlocks = blocks.filter(
//             (block) => !selectedBlockIds.includes(block.id)
//         );
//         setSelectedBlockIds([]);
//         setBlocks(updatedBlocks);
//     };

//     // const handleSave = async () => {
//     //     if (isSaving) return;
//     //     setIsSaving(true);
//     //     try {
//     //         console.log("tr")
//     //         handleSaveSubtitles(blocks, filename);
//     //     } catch (error) {
//     //         console.log(error)
//     //     } finally {
//     //         setIsSaving(false);
//     //     }

//     // }

//     const handleSave = async () => {
//         if (isSaving) return;
//         if (!filename) {
//             alert("Please enter a file name before saving.");
//             return;
//         }

//         setIsSaving(true);
//         try {
//             const response = await handleSaveSubtitles(blocks, filename);
//             // Show success message if needed
//             alert(`✅ Subtitles saved successfully as "${filename}.srt"`);
//             console.log(response);
//         } catch (error: any) {
//             // If Adonis returns a JSON error, show its message
//             const msg =
//                 error?.response?.data?.error ||
//                 error?.response?.data?.message ||
//                 error?.message ||
//                 "Failed to save subtitles";
//             alert(`❌ Error: ${msg}`);
//             console.error("Save subtitles error:", error);
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     return (
//         <div className="w-full h-full flex flex-col overflow-hidden relative pt-4">
//             <div className="flex justify-between h-[60px] w-full items-center px-4">
//                 <input
//                     onChange={(e) => setFilename(e.target.value)}
//                     value={filename}
//                     type="Accent"
//                     placeholder="Enter File Name"
//                     className="input input-primary-content"
//                 />
//                 <a ref={linkref} style={{ display: "none" }}></a>

//                 <ul className="menu menu-horizontal bg-base-100 rounded-box text-primary-content flex gap-4 items-center justify-center">
//                     <li>
//                         <a
//                             onClick={() =>
//                                 handleDownloadSubtitles(blocks, filename)
//                             }
//                         >
//                             Download
//                         </a>
//                     </li>
//                     {user && (
//                         <li>
//                             {isSaving ? (
//                                 <p>...</p>
//                             ) : (
//                                 <a onClick={handleSave}>Save</a>
//                             )}
//                         </li>
//                     )}
//                     <li>
//                         <a
//                             className="bg-primary-content hover:bg-base-300 text-base-100 hover:text-primary-content"
//                             onClick={handleUploadClick}
//                         >
//                             Upload SRT
//                         </a>
//                         <input
//                             onChange={handleFileUpload}
//                             ref={fileInputRef}
//                             accept=".srt"
//                             type="file"
//                             className="hidden file-input"
//                         />
//                     </li>
//                 </ul>
//             </div>

//             <div className="flex flex-col flex-1 h-full w-full overflow-y-scroll">
//                 {blocks.map((block) => (
//                     <SubtitleCard
//                         setSelectedBlockIds={setSelectedBlockIds}
//                         selectedBlockIds={selectedBlockIds}
//                         id={block.id}
//                         key={block.id}
//                         text={block.text}
//                         startSeconds={block.startSeconds}
//                         endSeconds={block.endSeconds}
//                     />
//                 ))}
//             </div>

//             <div className="w-full h-[50px] flex flex-row bg-primary-content items-center justify-end px-4 gap-4">
//                 <button
//                     onClick={handleAddBlock}
//                     className="btn btn-square btn-base btn-xs"
//                 >
//                     <Plus className="text-primary-content" size={15} />
//                 </button>
//                 <button
//                     onClick={handleClearSubtitles}
//                     className={`btn btn-xs btn-base text-primary-content cursor-pointer`}
//                 >
//                     Clear Subtitles
//                 </button>
//                 <button
//                     onClick={handleDeleteSelected}
//                     className={`btn btn-xs ${
//                         selectedBlockIds.length > 0
//                             ? "btn-base text-primary-content cursor-pointer"
//                             : "btn-disabled text-base-100"
//                     }`}
//                 >
//                     Delete Selected
//                 </button>
//             </div>
//         </div>
//     );
// }



import { useTimelineStore } from "store/myTimelineStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { parseJS, parseSRT } from "utils/srtParser";
import type { SubtitleBlock } from "types/timeline";
import { CheckCircle, Circle, Plus } from "lucide-react";
import {
    createTimeFromSeconds,
    timeToSeconds,
    validateTime,
} from "utils/timelineUtils";
import { handleDownloadSubtitles } from "api/download";
import { useAuth } from "context/AuthProvider";
import { handleSaveSubtitles } from "api/save";

export default function SubtitleList() {
    const { blocks, updateBlock, currentTime, setBlocks, removeBlock, insertBlock } = useTimelineStore();
    const { user } = useAuth();
    const fileInputRef = useRef<null | HTMLInputElement>(null);
    const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [filename, setFilename] = useState<string>("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const modalRef = useRef<HTMLDialogElement>(null);

    const showModal = (message: string, type: "success" | "error") => {
        setModalMessage(message);
        setModalType(type);
        modalRef.current?.showModal();
    };

    const handleUploadClick = (e: React.MouseEvent) => {
        if (!fileInputRef.current) return;
        e.preventDefault();
        fileInputRef.current.click();
    };

    const handleFileUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            try {
                const originalName = file.name;
                const newName = originalName.replace(/\.[^/.]+$/, "");
                const text = await file.text();
                const subtitles = parseSRT(text);
                setBlocks(subtitles);
                setFilename(newName);

                showModal(`SRT "${newName}" uploaded successfully!`, "success");
            } catch (error: any) {
                console.error("Error parsing SRT file:", error);
                showModal(`Failed to upload SRT: ${error.message || error}`, "error");
            }
        },
        [setBlocks]
    );

    const handleClearSubtitles = () => setBlocks([]);
    const handleAddBlock = () => insertBlock("Please Add Text", currentTime);
    const handleDeleteSelected = () => {
        if (!selectedBlockIds.length) return;
        const updatedBlocks = blocks.filter(b => !selectedBlockIds.includes(b.id));
        setSelectedBlockIds([]);
        setBlocks(updatedBlocks);
    };

    const handleSave = async () => {
        if (isSaving) return;
        if (!filename) {
            showModal("Please enter a file name before saving.", "error");
            return;
        }

        setIsSaving(true);
        try {
            const response = await handleSaveSubtitles(blocks, filename);
            console.log(response);
            showModal(`Subtitles saved successfully as "${filename}.srt"`, "success");
        } catch (error: any) {
            const msg =
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                error?.message ||
                "Failed to save subtitles";
            console.error("Save error:", error);
            showModal(msg, "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col overflow-hidden relative pt-4">
            {/* Top controls */}
            <div className="flex justify-between h-[60px] w-full items-center px-4">
                <input
                    onChange={(e) => setFilename(e.target.value)}
                    value={filename}
                    type="text"
                    placeholder="Enter File Name"
                    className="input input-primary-content"
                />
                <ul className="menu menu-horizontal bg-base-100 rounded-box text-primary-content flex gap-4 items-center justify-center">
                    <li>
                        <a onClick={() => handleDownloadSubtitles(blocks, filename)}>Download</a>
                    </li>
                    {user && (
                        <li>
                            {isSaving ? <p>...</p> : <a onClick={handleSave}>Save</a>}
                        </li>
                    )}
                    <li>
                        <a
                            className="bg-primary-content hover:bg-base-300 text-base-100 hover:text-primary-content"
                            onClick={handleUploadClick}
                        >
                            Upload SRT
                        </a>
                        <input
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                            accept=".srt"
                            type="file"
                            className="hidden"
                        />
                    </li>
                </ul>
            </div>

            {/* Subtitle blocks */}
            <div className="flex flex-col flex-1 h-full w-full overflow-y-scroll">
                {blocks.map((block) => (
                    <SubtitleCard
                        key={block.id}
                        id={block.id}
                        text={block.text}
                        startSeconds={block.startSeconds}
                        endSeconds={block.endSeconds}
                        selectedBlockIds={selectedBlockIds}
                        setSelectedBlockIds={setSelectedBlockIds}
                    />
                ))}
            </div>

            {/* Bottom controls */}
            <div className="w-full h-[50px] flex flex-row bg-primary-content items-center justify-end px-4 gap-4">
                <button onClick={handleAddBlock} className="btn btn-square btn-base btn-xs">
                    <Plus className="text-primary-content" size={15} />
                </button>
                <button onClick={handleClearSubtitles} className="btn btn-xs btn-base text-primary-content cursor-pointer">
                    Clear Subtitles
                </button>
                <button
                    onClick={handleDeleteSelected}
                    className={`btn btn-xs ${selectedBlockIds.length > 0 ? "btn-base text-primary-content cursor-pointer" : "btn-disabled text-base-100"}`}
                >
                    Delete Selected
                </button>
            </div>

            {/* DaisyUI modal for alerts */}
            <dialog id="alert_modal" className="modal" ref={modalRef}>
                <div className="modal-box">
                    <h3 className={`font-bold text-lg ${modalType === "error" ? "text-error" : "text-success"}`}>
                        {modalType === "error" ? "Error" : "Success"}
                    </h3>
                    <p className="py-4">{modalMessage}</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

// SubtitleCard remains unchanged
type SubtitleCardProps = {
    id: string;
    text: string;
    startSeconds: number;
    endSeconds: number;
    selectedBlockIds: string[] | null;
    setSelectedBlockIds: any;
};
const SubtitleCard = ({
    id,
    text,
    startSeconds,
    endSeconds,
    selectedBlockIds,
    setSelectedBlockIds,
}: SubtitleCardProps) => {
    const { updateBlock, removeBlock } = useTimelineStore();
    const [times, setTimes] = useState({
        start: createTimeFromSeconds(startSeconds),
        end: createTimeFromSeconds(endSeconds),
    });
    const [errors, setErrors] = useState({
        start: null as string | null,
        end: null as string | null,
    });

    useEffect(() => {
        setTimes({
            start: createTimeFromSeconds(startSeconds),
            end: createTimeFromSeconds(endSeconds),
        });
    }, [startSeconds, endSeconds]);

    const isSelected = selectedBlockIds?.includes(id);
    const durationOfSubititles = endSeconds - startSeconds;
    const cps =
        durationOfSubititles > 0
            ? Math.floor(text.length / durationOfSubititles)
            : 0;

    const textColor = isSelected ? "text-base-100" : "text-primary-content";
    const bgColor = !isSelected ? "bg-base-100" : "bg-primary-content";
    const errorStartColor = errors.start ? "text-error" : textColor;

    const handleSelect = () => {
        setSelectedBlockIds((prev: string[]) =>
            prev.includes(id)
                ? prev.filter((blockId) => blockId !== id)
                : [...prev, id]
        );
    };

    const handleTimeChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "start" | "end"
    ) => {
        const value = e.target.value;
        const isValid = validateTime(value);

        setTimes((prev) => ({ ...prev, [type]: value }));
        setErrors((prev) => ({
            ...prev,
            [type]: isValid ? null : "Invalid format! Use hh:mm:ss,mmm",
        }));
    };

    const handleTimeBlur = (type: "start" | "end") => {
        const startSec = timeToSeconds(times.start);
        const endSec = timeToSeconds(times.end);

        if (!times.start || !times.end || isNaN(startSec) || isNaN(endSec)) {
            setErrors((prev) => ({ ...prev, [type]: "Invalid time format!" }));
            return;
        }

        if (endSec <= startSec) {
            setErrors({
                start: "Start time must be before end time!",
                end: "End time must be after start time!",
            });
            return;
        }

        setErrors({ start: null, end: null }); // Clear errors if valid
        updateBlock(id, {
            startSeconds: startSec,
            endSeconds: endSec,
            startTime: times.start,
            endTime: times.end,
        });
    };

    const handleTextChange = (e: any) => {
        updateBlock(id, { text: e.target.value });
    };

    return (
        <div
            className={`w-full h-[170px] flex flex-col shrink-0 border-b border-base-300 ${bgColor}`}
        >
            <div
                className={`w-full h-auto border-t border-base-300 flex items-center justify-between p-2 px-4`}
            >
                <button className="cursor-pointer" onClick={handleSelect}>
                    {isSelected ? (
                        <CheckCircle size={18} className="text-base-100" />
                    ) : (
                        <Circle size={18} className="text-primary-content" />
                    )}
                </button>
                <button
                    onClick={() => removeBlock(id)}
                    className={`btn btn-xs text-xs cursor-pointer ${
                        isSelected
                            ? "text-base-100 bg-primary-content hover:bg-base-200 hover:text-primary-content"
                            : "text-primary-content"
                    }`}
                >
                    Delete
                </button>
            </div>

            <div className="w-full flex flex-1 px-2">
                <div className="w-[120px] h-full flex flex-col p-2 gap-2">
                    <div
                        className={`badge badge-xs mb-2 ${
                            cps > 21 ? "badge-error" : "badge-primary"
                        }`}
                    >
                        {cps} CPS
                    </div>
                    <input
                        type="text"
                        onChange={(e) => handleTimeChange(e, "start")}
                        onBlur={() => handleTimeBlur("start")}
                        value={times.start}
                        // value={createTimeFromSeconds(startSeconds)}
                        className={`text text-xs w-full rounded outline-0 border-0 ${errorStartColor}`}
                    />
                    <input
                        type="text"
                        // onChange={handleEndTimeChange}
                        // value={createTimeFromSeconds(endSeconds)}
                        value={times.end}
                        onChange={(e) => handleTimeChange(e, "end")}
                        onBlur={() => handleTimeBlur("end")}
                        className={`text text-xs w-full rounded outline-0 border-0 ${textColor}`}
                    />
                </div>

                <div className="flex-1 flex justify-center p-2">
                    <textarea
                        onChange={handleTextChange}
                        value={text}
                        className={`w-full rounded-lg h-[90px] text-sm p-2 ${textColor}`}
                    />
                </div>
            </div>
        </div>
    );
};
