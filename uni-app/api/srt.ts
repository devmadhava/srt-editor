import axios from "axios";
import { API_URL } from "constant/constant";
import type { SRTEntry } from "types/srt";

const API_BASE = `${API_URL}/srt`;

export const fetchFiles = async (token: string | null) => {
    if (!token) return [];

    try {
        const res = await axios.get<SRTEntry[]>(`${API_BASE}/all`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (error: any) {
        console.error("Fetch files error:", error.response?.data || error);
        throw error;
    }
};

export const fetchFile = async (id: string, token: string | null) => {
    if (!token) return null;

    const res = await axios.get<{ id: string; filename: string; url: string }>(
        `${API_BASE}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
};

export const updateFile = async (
    id: string,
    file: File,
    filename: string,
    token: string | null
) => {
    if (!token) return null;

    const formData = new FormData();
    formData.append("srt", file);
    formData.append("filename", filename);

    const res = await axios.patch(`${API_BASE}/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};

export const deleteFile = async (id: string, token: string | null) => {
    if (!token) return null;

    const res = await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
};
