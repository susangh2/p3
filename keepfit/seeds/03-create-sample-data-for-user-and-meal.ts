import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  //insert sample user
  let users = [
    {
      username: 'Alice',
      email: 'alice@abc.com',
      hash_password:
        '$2a$10$B5vX4n4SpYBgFNcmQunq7.t5UVA3grgq2YV7fEUBu9Nn2lbMLMPua',
      sex: 'Female',
      birthday: '2000-10-05',
      height: 160,
      weight: 48,
      active_level_id: (
        await knex('active_level')
          .select('id')
          .where('active_level', 'lightly active')
          .first()
      ).id,
      ideal_weight: 51,
    },
  ];

  let user_id;
  // Inserts seed entries
  for (let user of users) {
    let row = await knex
      .select('id')
      .from('users')
      .where({ username: user.username })
      .first();
    if (!row) {
      let rows = await knex.insert(user).into('users').returning('id');
      console.log('insert successfully');
      user_id = rows[0].id;
    } else {
      console.log('record existed: ', user);
      await knex('users').update(user).where('id', row.id);
      user_id = row.id;
    }
  }

  //insert sample meals
  let meals = [
    {
      user_id,
      food_id: (
        await knex('food').select('id').where('name', 'carbonara').first()
      ).id,
      user_photo_filename: 'food1.jpg',
      serving_size: 3,
    },
    {
      user_id,
      food_id: (
        await knex('food').select('id').whereILike('name', '%risotto%').first()
      ).id,
      user_photo_filename: 'food2.jpg',
      serving_size: 3,
    },
  ];

  for (let meal of meals) {
    let row = await knex
      .select('id')
      .from('users_meal_record')
      .where({ user_photo_filename: meal.user_photo_filename })
      .first();
    if (!row) {
      await knex.insert(meal).into('users_meal_record');
      console.log('insert successfully');
      continue;
    }
    console.log('record existed: ', meal);
  }
}
