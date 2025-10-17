import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Tag from './tag.js'

export default class Srt extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare filename: string

  @column()
  declare storagePath : string

  // @column()
  // declare language: string

  // @column()
  // declare isPrivate: boolean

  // @column()
  // declare showId: number

  // @belongsTo(() => Show)
  // declare show: BelongsTo<typeof Show>

  // @column()
  // declare seasonNumber: number | null

  // @column()
  // declare episodeNumber: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Tag)
  declare tags: ManyToMany<typeof Tag>

  // @hasMany(() => SubtitleLine)
  // declare subtitleLine: HasMany<typeof SubtitleLine>
}
