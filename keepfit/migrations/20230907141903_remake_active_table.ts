import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('user'))) return;
  await knex.schema.alterTable('user', (table) => {
    table.dropColumn('active_level_id');
  });
  await knex.schema.dropTable('active_level');
  await knex.schema.createTable('active_level', (table) => {
    table.increments();
    table.string('active_level');
  });
  await knex.schema.alterTable('user', (table) => {
    table.integer('active_level_id').unsigned();
    table.foreign('active_level_id').references('active_level.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('user'))) return;
  await knex.schema.alterTable('user', (table) => {
    table.dropColumn('active_level_id');
  });
  await knex.schema.dropTable('active_level');
  await knex.schema.createTable('active_level', (table) => {
    table.increments();
    table.string('lightly_active');
    table.string('moderately_active');
    table.string('active');
    table.string('very_active');
  });
  await knex.schema.alterTable('user', (table) => {
    table.integer('active_level_id').unsigned();
    table.foreign('active_level_id').references('active_level.id');
  });
}
