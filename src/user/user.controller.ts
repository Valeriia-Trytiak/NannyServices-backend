import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateUserDto } from './dto'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOkResponse({ description: 'User created successfully' })
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.save(dto)
  }

  @Get(':idOrEmail')
  @ApiOkResponse({ status: 200, description: '' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOneUser(@Param('idOrEmail') idOrEmail: string) {
    return this.userService.findOne(idOrEmail)
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id)
  }
}
