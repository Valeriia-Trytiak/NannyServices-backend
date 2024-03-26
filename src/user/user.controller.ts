import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors
} from '@nestjs/common'
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger'

import { CreateUserDto } from './dto'
import { UserResponse } from './responses'
import { UserService } from './user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiOkResponse({ description: 'User created successfully' })
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.userService.save(dto)
    return new UserResponse(user)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':idOrEmail')
  @ApiOkResponse({ status: 200, description: '' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOneUser(@Param('idOrEmail') idOrEmail: string) {
    const user = await this.userService.findOne(idOrEmail)
    return new UserResponse(user)
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id)
  }
}
