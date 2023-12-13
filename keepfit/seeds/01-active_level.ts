import { Knex } from 'knex';

const activeLevelArray = [
  'lightly active',
  'moderately active',
  'active',
  'very active',
];

export async function seed(knex: Knex): Promise<void> {
  // // Deletes ALL existing entries
  // await knex('active_level').del();

  // const data = activeLevelArray.map((level) => {
  //   return { active_level: level };
  // });
  // // Inserts seed entries
  // await knex('active_level').insert(data);

  for (let active_level of activeLevelArray) {
    let row = await knex
      .select('id')
      .from('active_level')
      .where({ active_level })
      .first();
    if (!row) {
      await knex.insert({ active_level }).into('active_level');
      console.log('insert successfully');
      continue;
    }
    console.log('record existed: ', row);
  }
}
