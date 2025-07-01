import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RefreshInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
