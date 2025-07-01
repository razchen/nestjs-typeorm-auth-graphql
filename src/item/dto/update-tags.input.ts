import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
export class UpdateTagsInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  tagNames: string[];
}
