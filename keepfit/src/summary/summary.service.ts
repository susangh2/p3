import { Injectable } from '@nestjs/common';
import { SummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class SummaryService {
  constructor(@InjectModel() private readonly knex: Knex) {}
  async dailyCalories(userId: number) {
    const today = new Date().toISOString().slice(0, 10);
    let dailyIntake = await this.knex('food')
      .sum('food.calories as totalCalories')
      .innerJoin('users_meal_record', 'food.id', 'users_meal_record.food_id')
      .whereRaw(`DATE(users_meal_record.created_at AT TIME ZONE 'UTC') =?`, [
        today,
      ])
      .andWhere('users_meal_record.user_id', userId)
      .first();
    let userDetails = await this.knex('users')
      .select(
        'username',
        'sex',
        'birthday',
        'height',
        'weight',
        'active_level_id',
        'ideal_weight',
      )
      .where('id', userId)
      .first();
    return { dailyIntake, userDetails };
  }

  async weeklyCalories(userId: number, query: SummaryDto) {
    let weeklyIntake = await this.knex('users_meal_record')
      .sum('food.calories as total_weekly_calories')
      .join('food', 'users_meal_record.food_id', 'food.id')
      .where('users_meal_record.user_id', userId)
      .andWhere('users_meal_record.created_at', '>=', query.from)
      .andWhere('users_meal_record.created_at', '<=', query.to)
      .groupBy('users_meal_record.user_id')
      .first();

    let userDetailsQuery = this.knex('users')
      .select(
        'username',
        'sex',
        'birthday',
        'height',
        'weight',
        'active_level_id',
        'ideal_weight',
      )
      .where('id', userId)
      .first();
    console.log('userDetailsQuery:', userDetailsQuery.toSQL());
    let userDetails = await userDetailsQuery;
    console.log({ weeklyIntake });
    return { weeklyIntake, userDetails };
  }
  findAll() {
    return `This action returns all summary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} summary`;
  }

  update(id: number, updateSummaryDto: UpdateSummaryDto) {
    return `This action updates a #${id} summary`;
  }

  remove(id: number) {
    return `This action removes a #${id} summary`;
  }
}
