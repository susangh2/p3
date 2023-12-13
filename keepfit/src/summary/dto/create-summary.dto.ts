import { IsNotEmpty } from 'class-validator';

export class SummaryDto {
  @IsNotEmpty()
  //   @IsDate()
  from!: string;

  @IsNotEmpty()
  //   @IsDate()
  to!: string;
}
