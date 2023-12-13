import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { FilterMealDto } from './dto/create-mealrecord.dto';
// import { UpdateMealrecordDto } from './dto/update-mealrecord.dto';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class MealrecordService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async loadMeal(userId: number) {
    const mealResult = await this.knex
      .select(
        'user_photo_filename',
        'serving',
        'created_at',
        'food.name',
        'food.calories',
        'food.protein',
        'food.carbohydrates',
        'food.fat',
        'users_meal_record.id',
      )
      .from('users_meal_record')
      .join('food', 'food.id', 'users_meal_record.food_id')
      .where('user_id', userId);
    console.log('loadMeal:', mealResult);
    if (mealResult.length === 0) {
      throw new NotFoundException('Meals not found');
    }
    return mealResult;
  }

  async mealDateFilter(userId: number, query: FilterMealDto) {
    const result = await this.knex('users_meal_record')
      .select(
        this.knex.raw("to_char(created_at, 'YYYY-MM-DD') as date"),
        'user_photo_filename',
        'serving',
        'name',
        'calories',
        'protein',
        'carbohydrates',
        'fat',
        'users_meal_record.id',
      )
      .join('food', 'food.id', 'users_meal_record.food_id')
      .where('user_id', userId)
      .whereBetween('created_at', [query.from, query.to]);
    console.log('mealDateFilter:', result);
    if (result.length === 0) {
      throw new NotFoundException('Meals not found');
    }

    return result;
  }

  findAll() {
    return `This action returns all mealrecord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mealrecord`;
  }

  // update(id: number, updateMealrecordDto: UpdateMealrecordDto) {
  //   return `This action updates a #${id} mealrecord`;
  // }

  async remove(id: number) {
    const delMeal = await this.knex('users_meal_record')
      .where('id', '=', id)
      .del();
    return { id };
  }
}
