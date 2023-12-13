import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class ProfileDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  sex!: string;

  @IsNotEmpty()
  @IsString()
  birthday!: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(40)
  @Max(250)
  height!: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(30)
  @Max(100)
  weight!: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(4)
  active_level_id!: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(40)
  @Max(150)
  ideal_weight!: string;
}
