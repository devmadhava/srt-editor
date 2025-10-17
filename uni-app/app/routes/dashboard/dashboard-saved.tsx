import Table from "components/dashboard/Table";

const srtFiles = [
    {
        id: 1,
        filename: "movie-subtitles.srt",
        createdAt: "2025-03-13T14:30:00Z",
        updatedAt: "2025-03-13T14:30:00Z",
    },
    {
        id: 2,
        filename: "episode-1.srt",
        createdAt: "2025-03-12T10:15:00Z",
        updatedAt: "2025-03-12T10:15:00Z",
    },
    {
        id: 3,
        filename: "anime-ep5.srt",
        createdAt: "2025-03-11T18:45:00Z",
        updatedAt: "2025-03-11T18:45:00Z",
    },
];

export default function DashboardHome() {
    return (
        <div className="w-full h-full overflow-y-scroll py-[5%]">
            <Table
                headers={["ID", "Filename", "Last Modified", "Options"]}
                data={srtFiles}
            />
        </div>
    );
}
