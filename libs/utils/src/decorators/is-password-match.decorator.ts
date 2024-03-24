import { SignUpDto } from '@auth/dto'
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'IsPasswordMatch', async: false })
export class PasswordMatchValidator implements ValidatorConstraintInterface {
  validate(passwordRepeat: string, args: ValidationArguments) {
    const obj = args.object as SignUpDto
    return obj.password === passwordRepeat
  }

  defaultMessage() {
    return 'Passwords do not match'
  }
}
