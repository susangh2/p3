import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.dropTableIfExists('active_level');

  await knex.schema.createTable('active_level', (table) => {
    table.increments();
    table.string('active_level');
  });

  await knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('username', 25).notNullable();
    table.string('email').notNullable();
    table.specificType('hash_password', 'char(60)').notNullable();
    table.string('sex', 10);
    table.date('birthday');
    table.float('height', 2).notNullable();
    table.float('weight', 2).notNullable();
    table.integer('active_level_id').unsigned();
    table.foreign('active_level_id').references('active_level.id');
    table.float('ideal_weight', 2).notNullable();
  });

  await knex.schema.createTable('food', (table) => {
    table.increments();
    table.string('name').notNullable();
    table.float('calories', 3).notNullable();
    table.float('protein', 3).notNullable();
    table.float('carbohyrates', 3).notNullable();
    table.float('fat', 3).notNullable();
    table.float('serving', 3);
  });

  await knex.schema.createTable('users_meal_record', (table) => {
    table.increments();
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id');
    table.integer('food_id').unsigned();
    table.foreign('food_id').references('food.id');
    table.string('user_photo_filename');
    table.float('serving_size');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('calories_consumption', (table) => {
    table.increments();
    table.string('sport_name', 60);
    table.float('consumption', 4);
    table.float('duration_minute', 2);
  });
}

export async function down(knex: Knex) {
  knex.schema.dropTable('calories_consumption');
  knex.schema.dropTable('users_meal_record');
  knex.schema.dropTable('food');
  knex.schema.dropTable('users');
  knex.schema.dropTable('active_level');
}
