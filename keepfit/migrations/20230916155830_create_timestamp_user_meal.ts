import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users_meal_record', (table) => {
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users_meal_record', (table) => {
    table.dropColumn('timestamp');
  });
}
