import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateItemDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
