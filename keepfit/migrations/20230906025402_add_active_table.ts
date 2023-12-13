import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('active_level')) return;
  await knex.schema.createTable('active_level', (table) => {
    table.increments();
    table.string('lightly_active');
    table.string('moderately_active');
    table.string('active');
    table.string('very_active');
  });
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasColumn('active_level', 'lightly_active')) {
    await knex.schema.dropTable('active_level');
  }
}
