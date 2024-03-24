import { PasswordMatchValidator } from '@utils/decorators'
import { IsEmail, IsString, MinLength, Validate } from 'class-validator'

export class SignUpDto {
  @IsString()
  @MinLength(3)
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsString()
  @MinLength(6)
  @Validate(PasswordMatchValidator)
  passwordRepeat: string
}
