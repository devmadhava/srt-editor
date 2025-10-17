import { fetchFiles } from "api/srt";
import Table from "components/dashboard/Table";
import { useAuth } from "context/AuthProvider";
import { useEffect, useState } from "react";
import type { SRTEntry } from "types/srt";

export default function DashboardHome() {

    const [allFiles, setAllFiles] = useState<SRTEntry[]>([]);
    const {user} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchFiles(user);
            setAllFiles(res);
        }
        fetchData();
    }, []);

    return (
        <div className="w-full h-full overflow-y-scroll">

            <div className="mb-[5%] px-4 flex">
                <h2 className="py-8 text-4xl text-bold text-primary-content">Your Subtitles</h2>
            </div>
            <Table
                headers={["ID", "Filename", "Last Modified", "Options"]}
                data={allFiles}
            />
        </div>
    );
}
