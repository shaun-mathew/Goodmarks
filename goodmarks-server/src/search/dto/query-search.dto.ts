import {
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  ValidationArguments,
  ValidatorConstraintInterface,
  Validate,
  Length,
} from 'class-validator';

class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return propertyValue < args.object[args.constraints[0]];
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" "must be be before "${args.constraints[0]}"`;
  }
}
export class SearchQuery {
  @IsString()
  @Length(2)
  query: string;

  @IsOptional()
  @IsDateString()
  @Validate(IsBeforeConstraint, ['dateEnd'])
  dateStart: Date;

  @IsOptional()
  @IsDateString()
  dateEnd: Date;

  @IsOptional()
  @IsUrl()
  url: string;
}
