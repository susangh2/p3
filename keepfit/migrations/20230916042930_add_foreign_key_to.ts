import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('calories_consumption', (table) => {
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('calories_consumption', (table) => {
    table.dropForeign(['user_id']);
    table.dropColumn('user_id');
  });
}
