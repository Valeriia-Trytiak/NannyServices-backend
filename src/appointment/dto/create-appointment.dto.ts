import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsDate, IsEmail, IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateAppointmentDto {
  @ApiProperty() //потом описать свагер
  @IsNotEmpty()
  @IsString()
  readonly address: string

  @ApiProperty()
  @IsNotEmpty()
  @IsMobilePhone()
  readonly phoneNumber: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly username: string

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  readonly time: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly childAge: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly nannyId: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly comment?: string
}
