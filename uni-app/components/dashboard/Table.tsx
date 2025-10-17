// import { Delete, PenIcon, Trash, Trash2 } from "lucide-react";

// interface SRTData {
//     file_name: string;
//     last_modified: string;
//     id: string | number;
//     location_uri: string;
// }

// interface TableProps {
//     headers: string[] | null;
//     data: SRTData[];
// }

// export default function Table({ headers, data }: TableProps) {
//     return (
//         <div className="overflow-x-auto">
//             <table className="table table-zebra">
//                 <thead>
//                     <tr>
//                         {headers?.map((header, index) => (
//                             <th key={index}>{header}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.map((file, index) => {
//                         const date = new Date(file.last_modified);
//                         const fmtDate = date.toLocaleString();
//                         return (
//                             <tr className="text-primary-content">
//                                 <th>{file.id}</th>
//                                 <td>{file.file_name}</td>
//                                 <td>{fmtDate}</td>
//                                 <td className=" flex items-center">
//                                     <button className="cursor-pointer transition hover:text-accent-content mr-5 ">
//                                         Edit
//                                     </button>
//                                     <label htmlFor="my_modal_7" className="cursor-pointer transition hover:text-error">
//                                         <Trash2 size={15} />
//                                     </label>
//                                 </td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>

//             <input type="checkbox" id="my_modal_7" className="modal-toggle" />
//             <div className="modal" role="dialog">
//                 <div className="modal-box">
//                     <h3 className="text-lg font-bold">Delete !</h3>
//                     <p className="py-4">
//                         Are you sure you want to delete this file?
//                     </p>
//                 </div>
//                 <label className="modal-backdrop" htmlFor="my_modal_7">
//                     Close
//                 </label>
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { SRTEntry } from "types/srt";
import { useAuth } from "context/AuthProvider";
import { deleteFile } from "api/srt";

// interface SRTData {
//     file_name: string;
//     last_modified: string;
//     id: string | number;
//     location_uri: string;
// }

interface TableProps {
    headers: string[] | null;
    data: SRTEntry[];
}

// export default function Table({ headers, data }: TableProps) {
//     const [selectedFile, setSelectedFile] = useState<SRTEntry | null>(null);

//     const handleDelete = () => {
//         if (selectedFile) {
//             console.log(`Deleting file: ${selectedFile.filename}`);
//         }
//     };

//     return (
//         <div className="overflow-x-auto">
//             <table className="table table-zebra">
//                 <thead>
//                     <tr>
//                         {headers?.map((header, index) => (
//                             <th key={index}>{header}</th>
//                         ))}
//                     </tr>
//                 </thead>

//                 {data && data.length > 0 && (
//                     <tbody>
//                         {data.map((file, index) => {
//                             const date = new Date(file.updatedAt);
//                             const fmtDate = date.toLocaleString();
//                             return (
//                                 <tr
//                                     className="text-primary-content"
//                                     key={index}
//                                 >
//                                     <th>{file.id}</th>
//                                     <td>{file.filename}</td>
//                                     <td>{fmtDate}</td>
//                                     <td className="flex items-center">
//                                         <button className="cursor-pointer transition hover:text-accent-content mr-5">
//                                             Edit
//                                         </button>
//                                         <label
//                                             htmlFor="delete_modal"
//                                             className="cursor-pointer transition hover:text-error"
//                                             onClick={() =>
//                                                 setSelectedFile(file)
//                                             }
//                                         >
//                                             <Trash2 size={15} />
//                                         </label>
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 )}

//                 {/* <tbody>
//                     {data.map((file, index) => {
//                         const date = new Date(file.updatedAt);
//                         const fmtDate = date.toLocaleString();
//                         return (
//                             <tr className="text-primary-content" key={index}>
//                                 <th>{file.id}</th>
//                                 <td>{file.filename}</td>
//                                 <td>{fmtDate}</td>
//                                 <td className="flex items-center">
//                                     <button className="cursor-pointer transition hover:text-accent-content mr-5">
//                                         Edit
//                                     </button>
//                                     <label
//                                         htmlFor="delete_modal"
//                                         className="cursor-pointer transition hover:text-error"
//                                         onClick={() => setSelectedFile(file)}
//                                     >
//                                         <Trash2 size={15} />
//                                     </label>
//                                 </td>
//                             </tr>
//                         );
//                     })}
//                 </tbody> */}
//             </table>

//             {!data || data.length === 0 && (
//                 <div className="w-full py-14 items-center justify-center">
//                     <p className="text-center ">Sorry, No Files made yet!</p>
//                 </div>
//             )}

//             <input type="checkbox" id="delete_modal" className="modal-toggle" />
//             <div className="modal" role="dialog">
//                 <div className="modal-box">
//                     <h3 className="text-lg font-bold">Delete File</h3>
//                     <p className="py-4">
//                         Are you sure you want to delete{" "}
//                         <b>{selectedFile?.filename}</b>?
//                     </p>
//                     <div className="modal-action">
//                         <label
//                             htmlFor="delete_modal"
//                             className="btn"
//                             onClick={handleDelete}
//                         >
//                             Confirm
//                         </label>
//                         <label htmlFor="delete_modal" className="btn btn-ghost">
//                             Cancel
//                         </label>
//                     </div>
//                 </div>
//                 <label className="modal-backdrop" htmlFor="delete_modal">
//                     Close
//                 </label>
//             </div>
//         </div>
//     );
// }

interface TableProps {
    headers: string[] | null;
    data: SRTEntry[];
}

export default function Table({ headers, data }: TableProps) {
    const [tableData, setTableData] = useState<SRTEntry[]>(data);
    const [selectedFile, setSelectedFile] = useState<SRTEntry | null>(null);

    const { user } = useAuth();

    const handleDelete = async () => {
        if (!selectedFile || !user) return;

        try {
            await deleteFile(selectedFile.id.toString(), user);

            // Remove locally from tableData
            setTableData((prev) =>
                prev.filter((file) => file.id !== selectedFile.id)
            );

            setSelectedFile(null);
        } catch (err) {
            console.error("Error deleting file:", err);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra">
                <thead>
                    <tr>
                        {headers?.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {tableData.map((file) => {
                        const date = new Date(file.updatedAt);
                        const fmtDate = date.toLocaleString();
                        return (
                            <tr className="text-primary-content" key={file.id}>
                                <th>{file.id}</th>
                                <td>{file.filename}</td>
                                <td>{fmtDate}</td>
                                <td className="flex items-center">
                                    <button
                                        className="cursor-pointer transition hover:text-accent-content mr-5"
                                        onClick={() =>
                                            console.log("Edit clicked")
                                        }
                                    >
                                        Edit
                                    </button>
                                    <label
                                        htmlFor="delete_modal"
                                        className="cursor-pointer transition hover:text-error"
                                        onClick={() => setSelectedFile(file)}
                                    >
                                        <Trash2 size={15} />
                                    </label>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <input type="checkbox" id="delete_modal" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Delete File</h3>
                    <p className="py-4">
                        Are you sure you want to delete{" "}
                        <b>{selectedFile?.filename}</b>?
                    </p>
                    <div className="modal-action">
                        <label
                            htmlFor="delete_modal"
                            className="btn"
                            onClick={handleDelete}
                        >
                            Confirm
                        </label>
                        <label htmlFor="delete_modal" className="btn btn-ghost">
                            Cancel
                        </label>
                    </div>
                </div>
                <label className="modal-backdrop" htmlFor="delete_modal">
                    Close
                </label>
            </div>
        </div>
    );
}
