import { useSubtitleStore } from "store/subtitleStore";
import { useCallback, useEffect, useRef, useState } from "react";
import { parseJS, parseSRT } from "utils/srtParser";
import { downloadFile } from "utils/downloadFile";
import SRTUpload from "components/timeline/SRTUpload";
import MiniUpload from "components/timeline/MiniUpload";
import MyTimeline from "components/timeline/MyTimeline";
import VideoPlayer from "components/timeline/VideoPlayer";
import SubtitleList from "components/timeline/SubtitleList";
import MiniTimeline from "components/timeline/MiniTimeline";
import type { Route } from "../+types/root";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "context/AuthProvider";
import PrivateRoute from "components/PrivateRoute";
import Navbar from "components/Navbar";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "SRT Editor App" },
        {
            name: "description",
            content: "Welcome to SRT Editor! Create subtitles easy and simple.",
        },
    ];
}

export default function Editor() {
    const { user } = useAuth();
    const location = useLocation();

    const setSubtitles = useSubtitleStore((state) => state.setSubtitles);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [filename, setFilename] = useState<string | null>(null);

    const handleFileUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            console.log("run");
            const file = event.target.files?.[0];
            if (!file) return;

            try {
                const fName = file.name;
                setFilename(fName);

                const text = await file.text();
                const subtitles = parseSRT(text);
                setSubtitles(subtitles);

                const srtString = parseJS(subtitles);
                const url = downloadFile(srtString, fName);
                setDownloadUrl(url);
            } catch (error) {
                console.error("Error parsing SRT file:", error);
            }
        },
        [setSubtitles]
    );

    useEffect(() => {
        return () => {
            if (downloadUrl) {
                URL.revokeObjectURL(downloadUrl);
                console.log("Revoked URL on cleanup:", downloadUrl);
            }
        };
    }, [downloadUrl]);

    const handleDownloadClick = () => {
        if (downloadUrl) {
            setTimeout(() => {
                URL.revokeObjectURL(downloadUrl);
                console.log("Revoked URL after download:", downloadUrl);
                setDownloadUrl(null);
            }, 500); // Short delay to ensure download starts
        }
    };

    return (
        // <PrivateRoute>
            <div className="relative pb-[60px] pt-[68px] md:pb-0 bg-base-200">
                {/* <ProtectedNavbar /> */}
                <Navbar />
                <div 
                    className="min-h-screen h-[1100px]
                    md:h-screen grid sm:grid-rows-[1fr_1fr_110px] 
                    md:grid-rows-[1fr_110px] sm:grid-cols-1 md:grid-cols-2 
                    bg-base-200"
                >
                    <div className="bg-base-100 rounded-lg shadow relative flex overflow-y-scroll m-4 mb-2 md:m-4 md:mr-2">
                        <div className="w-full">
                            <SubtitleList />
                        </div>
                    </div>

                    <div className="text-white rounded-lg flex justify-center m-4 mt-2 md:m-4 md:ml-2">
                        <div className="w-[100%] h-[100%] p-4 rounded-lg shadow overflow-hidden bg-base-100">
                            <VideoPlayer />
                        </div>
                    </div>


                    {/* Complete Timeline */}
                    <div className="hidden md:flex bg-base-200 text-white rounded-lg sm:row-span-1 md:col-span-2 w-full h-[110px]">
                        <div className="w-full h-full bg-amber-100">
                            <MyTimeline />
                        </div>
                    </div>
                </div>

                {/* Mini Timeline */}
                <div className="w-full h-[60px] bg-amber-400 flex md:hidden fixed bottom-0">
                    <MiniTimeline />
                </div>
            </div>
        // </PrivateRoute>
    );
}

