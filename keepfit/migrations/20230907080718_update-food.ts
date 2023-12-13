import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('food', (table) => {
    table.renameColumn('carbohyrates', 'carbohydrates');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('food', (table) => {
    table.renameColumn('carbohydrates', 'carbohyrates');
  });
}
