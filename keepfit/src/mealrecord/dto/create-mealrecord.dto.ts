import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class FilterMealDto {
  @IsNotEmpty()
  //   @IsDate()
  from!: string;

  @IsNotEmpty()
  //   @IsDate()
  to!: string;
}
