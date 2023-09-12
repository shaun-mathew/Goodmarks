import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class GetMetadataDto {
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsString()
  html: string;
}
