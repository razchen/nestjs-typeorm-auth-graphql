import { IsArray, IsString } from 'class-validator';

export class UpdateTagsDto {
  @IsArray()
  @IsString({ each: true })
  tagNames: string[];
}
