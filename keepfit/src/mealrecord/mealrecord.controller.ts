import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Session,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MealrecordService } from './mealrecord.service';
import { FilterMealDto } from './dto/create-mealrecord.dto';
import session from 'express-session';
import { SessionType } from 'src/session';
import { query } from 'express';
import { AuthGuard } from 'src/auth.guard';

@Controller('meal')
export class MealrecordController {
  constructor(private readonly mealrecordService: MealrecordService) {}

  @Get()
  @UseGuards(AuthGuard)
  async loadmeals(@Session() session: SessionType) {
    let userId = session.user_id;
    if (!userId) throw new UnauthorizedException();
    // let userId = 3;
    return await this.mealrecordService.loadMeal(userId);
    // console.log(await this.mealrecordService.loadMeal(userId));
  }

  @Get('filter')
  @UseGuards(AuthGuard)
  async mealDateFilter(
    @Query() query: FilterMealDto,
    @Session() session: SessionType,
  ) {
    let userId = session.user_id;
    if (!userId) throw new UnauthorizedException();
    // console.log('Query', query);
    // let userId = 3;
    return await this.mealrecordService.mealDateFilter(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mealrecordService.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.mealrecordService.remove(+id);
    // let result = await this.mealrecordService.remove(+id);
    // console.log(result);
    // return result;
  }
}
