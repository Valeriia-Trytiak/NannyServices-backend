import { IsInt, IsNotEmpty } from 'class-validator'

export class ToggleFavoriteDto {
  @IsNotEmpty()
  @IsInt()
  nannyId: number
}
