import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";
import Srt from "./srt.js";

export default class SubtitleLine extends BaseModel {
    @column({ isPrimary: true })
    declare id: number;

    @column()
    declare srtId: number;

    @column()
    declare lineNumber: number;

    @column()
    declare startTime: number;

    @column()
    declare endTime: number;

    @column()
    declare text: string;

    @belongsTo(() => Srt)
    declare srt: BelongsTo<typeof Srt>;
}
