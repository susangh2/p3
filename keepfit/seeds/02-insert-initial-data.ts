import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // await knex.raw(`TRUNCATE calories_consumption RESTART IDENTITY CASCADE;`);
  //   await knex('calories_consumption').del();
  //   await knex('food').del();
  //   await knex('active_level').del();

  //-----------------sport data insert without repeat logic-------------------
  let sportDatas = [
    {
      sport_name: 'running',
      consumption: 600,
      duration_minute: 60,
    },
    {
      sport_name: 'swimming',
      consumption: 400,
      duration_minute: 60,
    },
    {
      sport_name: 'walking',
      consumption: 270,
      duration_minute: 60,
    },
  ];

  let calories_table = 'calories_consumption';

  for (let data of sportDatas) {
    console.log('data', data);
    let row = await knex
      .select('id')
      .from(calories_table)
      .where({ sport_name: data.sport_name })
      .first();
    if (!row) {
      await knex.insert(data).into(calories_table);
      console.log('insert successfully');
      continue;
    }
    console.log(row);
    console.log('it fking exist');
  }
  //-----------------------foodDatas insert without repeat logic----------------------------------------
  let foodDatas = [
    {
      name: 'carbonara',
      calories: 764.5,
      carbohydrates: 90.8,
      fat: 31.2,
      protein: 28.8,
      serving: 265.15,
    },
    {
      name: 'quinoa risotto with mushrooms',
      calories: 212,
      carbohydrates: 30,
      fat: 5,
      protein: 7,
      serving: 221,
    },
    {
      name: 'all_day_breakfast',
      calories: 430,
      carbohydrates: 21,
      fat: 31,
      protein: 18,
      serving: 255,
    },
    {
      name: 'steak',
      calories: 614,
      carbohydrates: 0,
      fat: 41,
      protein: 58,
      serving: 221,
    },
    {
      name: 'burger_with_fries',
      calories: 1009,
      carbohydrates: 102,
      fat: 51,
      protein: 42,
      serving: 22.68,
    },
    {
      name: 'caesar_salad',
      calories: 88,
      carbohydrates: 4.3,
      fat: 4.2,
      protein: 3.2,
      serving: 200,
    },
  ];

  for (let data of foodDatas) {
    let row = await knex
      .select('id')
      .from('food')
      .where({ name: data.name })
      .first();

    if (!row) {
      await knex.insert(data).into('food');
      continue;
    }
    console.log('the data alreadt exist');
  }
  //-----------level checking----------------
  let levelDatas = [
    { active_level: 'lightly_active' },
    { active_level: 'moderately_active' },
    { active_level: 'active' },
    { active_level: 'very_active' },
  ];

  for (let data of levelDatas) {
    let row = await knex
      .select('id')
      .from('active_level')
      .where({ active_level: data.active_level })
      .first();
    if (!row) {
      await knex.insert(data).into('active_level');
      continue;
    }
    console.log('the data fking exist');
  }
}
