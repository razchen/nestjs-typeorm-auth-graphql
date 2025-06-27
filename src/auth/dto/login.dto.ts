import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Min(6)
  password: string;
}
