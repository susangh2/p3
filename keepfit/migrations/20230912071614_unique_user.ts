import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('users').where({ id: 2 }).delete();
  await knex.schema.alterTable('users', (table) => {
    table.unique(['username']);
  });

  await knex.schema.alterTable('users', (table) => {
    table.unique(['email']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropUnique(['username']);
  });

  await knex.schema.alterTable('users', (table) => {
    table.dropUnique(['email']);
  });
}
