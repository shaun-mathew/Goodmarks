import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Length,
} from 'class-validator';
import { UUID } from 'crypto';

export class UpdateBookmarkDto {
  @IsNotEmpty()
  @IsUUID(4)
  id: UUID;

  @IsOptional()
  @IsString()
  @Length(1)
  title: string;

  @IsOptional()
  @IsUrl()
  icon: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  markup: string;

  @IsOptional()
  @IsString()
  userDescription: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
