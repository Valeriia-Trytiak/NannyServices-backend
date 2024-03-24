import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { Response } from 'express'

import { AuthService } from './auth.service'
import { SignUpDto, SingInDto } from './dto'
import { Tokens } from './interfaces'

const REFRESH_TOKEN = 'refreshtoken'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}
  @Post('signup')
  @ApiOkResponse({ description: 'User registration successfully' })
  async signup(@Body() dto: SignUpDto) {
    await this.authService.signup(dto)
    // if (!user) {
    //   throw new BadRequestException(`It is not possible to create a user with this data ${JSON.stringify(dto)}`)
    // }
  }

  @Post('singin')
  @ApiOkResponse({ description: 'User login successful' })
  async singin(@Body() dto: SingInDto, @Res() res: Response) {
    const tokens = await this.authService.singin(dto)
    if (!tokens) {
      throw new BadRequestException()
    }
    this.getRefreshTokenToCookies(tokens, res)
    // return { accessToken: tokens.accessToken }
    // return tokens
  }

  @Get('refresh')
  @ApiOkResponse()
  refreshTokens() {}

  private getRefreshTokenToCookies(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException()
    }
    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.exp),
      secure: this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/'
    })
    res.status(HttpStatus.CREATED).json(tokens)
  }
}
