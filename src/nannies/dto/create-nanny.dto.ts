import { Type } from 'class-transformer'
import { IsArray, IsDate, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'

export class CreateNannyDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  avatarUrl: string

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthday: Date

  @IsNotEmpty()
  @IsString()
  experience: string

  @IsNotEmpty()
  @IsString()
  education: string

  @IsNotEmpty()
  @IsString()
  kidsAge: string

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  pricePerHour: number

  @IsNotEmpty()
  @IsString()
  location: string

  @IsNotEmpty()
  @IsString()
  about: string

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  characters: string[]
}
