import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class FindQuery {
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  url: string;
}
