import { Transform } from 'class-transformer';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Max,
  Min,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  validate,
} from 'class-validator';
import { isFloat32Array } from 'util/types';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomTextLength implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const asNum = Number(text);
    if (Number.isNaN(asNum)) return false;
    return asNum > 100 && asNum < 5000;
  }

  defaultMessage(args: ValidationArguments) {
    return 'string number ($value) is too big or too small';
  }
}

export class RegisterDto {
  static idealWeight(idealWeight: any): any {
    throw new Error('Method not implemented.');
  }
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsNotEmpty()
  @IsString()
  sex!: string;

  @IsNotEmpty()
  @IsString()
  birthday!: string;

  // @IsNotEmpty()
  // @IsString()
  // @IsNumberString()
  @Transform(({ value }) => parseFloat(value))
  // @IsDecimal()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(40)
  @Max(250)
  height!: string;

  // @IsNotEmpty()
  // @IsString()
  // @IsNumberString()
  @Transform(({ value }) => parseFloat(value))
  // @IsDecimal()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(30)
  @Max(100)
  weight!: string;

  // @IsNotEmpty()
  // @IsString()
  // @IsNumberString()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(10)
  @Max(90)
  idealWeight!: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(4)
  activeLevel!: string;
}
