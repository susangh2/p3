import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { SessionType } from 'src/session';
import { string } from 'cast.ts';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  // @Post()
  // create(@Body() createSummaryDto: CreateSummaryDto) {
  //   return this.summaryService.create(createSummaryDto);
  // }

  @Get('daily')
  async dailyIntake(@Session() session: SessionType) {
    // console.log('dailyIntake');
    const user_id = session.user_id;
    // const user_id = 3;
    if (!user_id) throw new UnauthorizedException();
    return await this.summaryService.dailyCalories(user_id);
  }

  @Get('weekly')
  async weeklyIntake(
    @Query() query: SummaryDto,
    @Session() session: SessionType,
  ) {
    console.log('weeklyIntake', query);
    const user_id = session.user_id;
    // const user_id = 3;
    if (!user_id) throw new UnauthorizedException();
    return await this.summaryService.weeklyCalories(user_id, query);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.summaryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSummaryDto: UpdateSummaryDto) {
  //   return this.summaryService.update(+id, updateSummaryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.summaryService.remove(+id);
  // }
}
