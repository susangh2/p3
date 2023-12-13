import Knex from 'knex';
import { env } from './env';

const knexConfigs = require('../knexfile');

const configMode = env.NODE_ENV;
const knexConfig = knexConfigs[configMode];
const knex = Knex(knexConfig);

async function accessData() {
  await knex
    .insert([
      {
        sport_name: 'running',
        consumption: 290,
        duration_minute: 60,
      },
      {
        sport_name: 'swimming',
        consumption: 290,
        duration_minute: 60,
      },
      {
        sport_name: 'walking',
        consumption: 181,
        duration_minute: 60,
      },
    ])
    .into('calories_consumption');

  await knex
    .insert([
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
    ])
    .into('food');

  await knex
    .insert([
      { active_level: 'lightly_active' },
      { active_level: 'moderately_active' },
      { active_level: 'active' },
      { active_level: 'very_active' },
    ])
    .into('active_level');

  console.log('after seed');
}

accessData();
