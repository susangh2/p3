import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('user'))) return;
  await knex.schema.alterTable('user', (table) => {
    table.renameColumn('width', 'weight');
  });
}

export async function down(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('user'))) return;
  await knex.schema.alterTable('user', (table) => {
    table.renameColumn('weight', 'width');
  });
}
