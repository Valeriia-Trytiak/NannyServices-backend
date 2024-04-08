import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { JwtPayload } from '@auth/interfaces'
import { Nanny } from '@prisma/client'
import { CurrentUser, Public } from '@utils/decorators'

import { CreateNannyDto, UpdateNannyDto } from './dto'
import { NanniesService } from './nannies.service'

@ApiTags('nannies')
@Controller('nannies')
export class NanniesController {
  constructor(private readonly nanniesServise: NanniesService) {}

  @Public()
  @Get()
  @ApiOkResponse()
  async getAllNannies(
    @Query('sort') sort: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '3'
  ) {
    const parsedPage = parseInt(page, 10)
    const parsedPageSize = parseInt(pageSize, 10)

    if (sort) {
      return this.nanniesServise.findAllWithSort(sort, parsedPage, parsedPageSize)
    } else {
      return this.nanniesServise.findAll(parsedPage, parsedPageSize)
    }
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse({ status: 404, description: 'Nanny not found' })
  async getNannyById(@Param('id', ParseIntPipe) id: number) {
    const nanny = await this.nanniesServise.findById(id)
    if (!nanny) {
      throw new NotFoundException('Nanny not found')
    }
    return nanny
  }

  @Post()
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async createNanny(@Body() nannyDto: CreateNannyDto, @CurrentUser() user: JwtPayload): Promise<Nanny> {
    return this.nanniesServise.create(nannyDto, user)
  }

  @Put(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async updateNanny(
    @Param('id', ParseIntPipe) id: number,
    @Body() nannyDto: UpdateNannyDto,
    @CurrentUser()
    user: JwtPayload
  ): Promise<Nanny> {
    return this.nanniesServise.update(id, nannyDto, user)
  }

  @Delete(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async deleteNanny(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.nanniesServise.remove(id, user)
  }
}
