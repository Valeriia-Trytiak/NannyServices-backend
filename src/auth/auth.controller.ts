import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { UserResponse } from '@user/responses'
import { Cookie, Public, UserAgent } from '@utils/decorators'
import { Response } from 'express'

import { AuthService } from './auth.service'
import { SignUpDto, SingInDto } from './dto'
import { Tokens } from './interfaces'

const REFRESH_TOKEN = 'refreshtoken'
@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup') //не работает публичный роутер
  @ApiOkResponse({ description: 'User registration successfully' })
  async signup(@Body() dto: SignUpDto) {
    const user = await this.authService.signup(dto)
    return new UserResponse(user)
  }

  @Post('singin')
  @ApiOkResponse({ description: 'User login successful' })
  async singin(@Body() dto: SingInDto, @Res() res: Response, @UserAgent() agent: string) {
    const tokens = await this.authService.singin(dto, agent)
    if (!tokens) {
      throw new BadRequestException()
    }
    this.setRefreshTokenToCookies(tokens, res)
  }

  @Get('refresh-tokens')
  @ApiOkResponse()
  async refreshTokens(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response, @UserAgent() agent: string) {
    if (!refreshToken) {
      throw new UnauthorizedException()
    }
    const tokens = await this.authService.refreshTokens(refreshToken, agent)
    if (!tokens) {
      throw new UnauthorizedException()
    }
    this.setRefreshTokenToCookies(tokens, res)
  }

  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
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
    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken })
  }
}
