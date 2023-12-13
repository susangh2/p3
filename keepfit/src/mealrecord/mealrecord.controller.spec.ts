import { Test, TestingModule } from '@nestjs/testing';
import { MealrecordController } from './mealrecord.controller';
import { MealrecordService } from './mealrecord.service';

describe('MealrecordController', () => {
  let controller: MealrecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealrecordController],
      providers: [MealrecordService],
    }).compile();

    controller = module.get<MealrecordController>(MealrecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
