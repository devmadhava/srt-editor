import Srt from "#models/srt";
import { srtValidator } from "#validators/srt";
import { cuid } from "@adonisjs/core/helpers";
import type { HttpContext } from "@adonisjs/core/http";
import drive from "@adonisjs/drive/services/main";

export default class SubtitlesController {
    public async save({ request, response, auth }: HttpContext) {
        const user = auth.user!;
        if (!user) {
            return response.forbidden(
                "You do not have permission to perform this action."
            );
        }

        try {
            const payload = await request.validateUsing(srtValidator);

            // Check duplicate by filename + user
            const existing = await Srt.query()
                .where("filename", payload.filename)
                .where("user_id", user.id)
                .first();

            if (existing) {
                return response.conflict({
                    error: "This subtitle file already exists",
                });
            }

            // Save file
            const file = payload.srt;
            const key = `uploads/${cuid()}.${file.extname}`;
            await file.moveToDisk(key);

            // Create DB entry
            const srt = await Srt.create({
                userId: user.id,
                filename: payload.filename,
                storagePath: key,
            });

            // Generate signed URL
            const signedUrl = await drive
                .use()
                .getSignedUrl(key, { expiresIn: "15m" });

            return response.created({
                message: "SRT uploaded",
                srt,
                url: signedUrl,
            });
        } catch (error) {
            console.error(error);
            return response.internalServerError({
                success: false,
                message: "Could not save SRT",
            });
        }
    }

    /**
     * Update an existing SRT file
     */
    public async update({ request, response, auth, params }: HttpContext) {
        const user = auth.user!;
        if (!user) {
            return response.forbidden(
                "You do not have permission to perform this action."
            );
        }

        try {
            const payload = await request.validateUsing(srtValidator);
            const srt = await Srt.findOrFail(params.id);

            if (srt.userId !== user.id) {
                return response.forbidden("Not your file");
            }

            // Remove old file
            if (srt.storagePath) {
                await drive.use().delete(srt.storagePath);
            }

            // Save new file
            const file = payload.srt;
            const key = `uploads/${cuid()}.${file.extname}`;
            await file.moveToDisk(key);

            // Update DB entry
            srt.merge({
                filename: payload.filename,
                storagePath: key,
            });
            await srt.save();

            // New signed URL
            const signedUrl = await drive
                .use()
                .getSignedUrl(key, { expiresIn: "15m" });

            return {
                message: "SRT updated",
                srt,
                url: signedUrl,
            };
        } catch (error) {
            console.error(error);
            return response.internalServerError({
                success: false,
                message: "Could not update SRT",
            });
        }
    }

    /**
     * Fetch a single SRT metadata + signed URL
     */
    public async fetch({ params, response, auth }: HttpContext) {
        const user = auth.user!;
        if (!user) {
            return response.forbidden(
                "You do not have permission to perform this action."
            );
        }

        const srt = await Srt.findOrFail(params.id);

        if (srt.userId !== user.id) {
            return response.forbidden("You do not have access to this file");
        }

        const signedUrl = await drive.use().getSignedUrl(srt.storagePath, {
            expiresIn: "15m",
        });

        return {
            id: srt.id,
            filename: srt.filename,
            createdAt: srt.createdAt,
            url: signedUrl,
        };
    }

    /**
     * Fetch a single SRT metadata + signed URL
     */
    public async fetchAll({ response, auth }: HttpContext) {
        const user = auth.user!;
        
        if (!user) {
            return response.forbidden(
                "You do not have permission to perform this action."
            );
        }

        console.log("fetch all")

        const srts = await Srt.query()
            .where("user_id", user.id)
            .select("id", "filename", "created_at");

        const formattedSrts = srts.map((srt) => ({
            id: srt.id,
            filename: srt.filename,
            createdAt: srt.createdAt,
            updatedAt: srt.updatedAt,
        }));

        return response.ok(formattedSrts);
    }

    /**
     * Delete an SRT file + DB entry
     */
    public async delete({ params, response, auth }: HttpContext) {
        const user = auth.user!;
        if (!user) {
            return response.forbidden(
                "You do not have permission to perform this action."
            );
        }

        const srt = await Srt.findOrFail(params.id);

        if (srt.userId !== user.id) {
            return response.forbidden("Not your file");
        }

        // Remove from storage
        if (srt.storagePath) {
            await drive.use().delete(srt.storagePath);
        }

        // Remove DB entry
        await srt.delete();

        return {
            message: "SRT deleted successfully",
            id: params.id,
        };
    }
}
