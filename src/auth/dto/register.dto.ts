import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Min(6)
  password: string;
}
