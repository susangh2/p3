import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex('calories_consumption')
    .whereIn('sport_name', ['running', 'swimming', 'walking'])
    .update({
      consumption: knex.raw(`CASE 
                              WHEN sport_name = 'running' THEN 600
                              WHEN sport_name = 'swimming' THEN 400
                              WHEN sport_name = 'walking' THEN 270
                            END`),
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex('calories_consumption')
    .whereIn('sport_name', ['running', 'swimming', 'walking'])
    .update({
      consumption: knex.raw(`CASE 
                              WHEN sport_name = 'running' THEN 290
                              WHEN sport_name = 'swimming' THEN 290
                              WHEN sport_name = 'walking' THEN 181
                            END`),
    });
}
