import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsUrl()
  icon: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  userDescription: string;

  @IsNotEmpty()
  @IsString()
  markup: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNotEmpty()
  @IsDateString()
  date: Date;
}
