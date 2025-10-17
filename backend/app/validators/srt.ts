import vine from "@vinejs/vine";

export const srtValidator = vine.compile(
    vine.object({
        filename: vine.string(),
        srt: vine.file({
            size: "4mb",
            extnames: ["srt"],
        }),
    })
);
