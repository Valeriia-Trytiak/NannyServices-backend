import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

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
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  async getAll(@CurrentUser() user: JwtPayload): Promise<Nanny[]> {
    return this.favoritesService.getAll(user)
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse({ status: 404, description: 'Nanny not found' })
  async getNannyByID(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload): Promise<Nanny> {
    return this.favoritesService.getById(id, user)
  }

  @Post()
  @ApiOkResponse()
  @ApiNotFoundResponse({ status: 404, description: 'Nanny or user not found' })
  async toggleFavorite(@Body() dataId: ToggleFavoriteDto, @CurrentUser() user: JwtPayload): Promise<Nanny[]> {
    return this.favoritesService.toggleFavorite(user, dataId.nannyId)
  }
}
