import { Test, TestingModule } from '@nestjs/testing';
import { MealrecordService } from './mealrecord.service';

describe('MealrecordService', () => {
  let service: MealrecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealrecordService],
    }).compile();

    service = module.get<MealrecordService>(MealrecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
