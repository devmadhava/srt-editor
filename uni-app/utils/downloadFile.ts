export function downloadFile(srtContent : string, filename = "subtitles.srt") {
    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    return url;
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = filename;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url); // Release the URL
}
