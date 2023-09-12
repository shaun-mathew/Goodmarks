import { IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 25)
  @Matches(/[\w!@#$%^&*\-_]+/i)
  username: string;

  @IsNotEmpty()
  @Length(1, 100)
  @Matches(/[\w!@#$%^&*\-_]+/i)
  password: string;
}
