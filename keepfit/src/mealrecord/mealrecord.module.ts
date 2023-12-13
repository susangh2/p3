import { Module } from '@nestjs/common';
import { MealrecordService } from './mealrecord.service';
import { MealrecordController } from './mealrecord.controller';

@Module({
  controllers: [MealrecordController],
  providers: [MealrecordService],
})
export class MealrecordModule {}
