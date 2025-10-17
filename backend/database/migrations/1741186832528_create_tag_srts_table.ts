import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tag_srts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('srt_id').unsigned().notNullable()
      table.integer('tag_id').unsigned().notNullable()
      table.foreign('srt_id').references('srts.id').onDelete('CASCADE')
      table.foreign('tag_id').references('tags.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}