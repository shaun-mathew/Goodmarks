import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
