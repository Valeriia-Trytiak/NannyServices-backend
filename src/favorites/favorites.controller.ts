import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { JwtPayload } from '@auth/interfaces'
import { Nanny } from '@prisma/client'
import { CurrentUser } from '@utils/decorators'

import { ToggleFavoriteDto } from './dto'
import { FavoritesService } from './favorites.service'

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOkResponse()
  async getAll(@CurrentUser() user: JwtPayload): Promise<Nanny[]> {
    return this.favoritesService.getAll(user)
  }

  @Post()
  @ApiOkResponse()
  async toggleFavorite(@Body() dataId: ToggleFavoriteDto, @CurrentUser() user: JwtPayload): Promise<Nanny[]> {
    return this.favoritesService.toggleFavorite(user, dataId.nannyId)
  }
}
