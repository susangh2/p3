import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('user'))) return;
  await knex.schema.alterTable('user', (table) => {
    table.string('sex');
    table.date('birthday');
    table.integer('active_level_id').unsigned();
    table.foreign('active_level_id').references('active_level.id');
    table.integer('ideal_weight');
  });
}

export async function down(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('user'))) return;
  await knex.schema.alterTable('user', (table) => {
    table.dropColumn('sex');
    table.dropColumn('birthday');
    table.dropColumn('active_level_id');
    table.dropColumn('active_level_id');
    table.dropColumn('ideal_weight');
  });
}
