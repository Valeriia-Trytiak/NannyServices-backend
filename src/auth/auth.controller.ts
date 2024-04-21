import { HttpService } from '@nestjs/axios'
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { UserResponse } from '@user/responses'
import { Cookie, Public, UserAgent } from '@utils/decorators'
import { handleTimeoutAndErrors } from '@utils/helpers'
import { Request, Response } from 'express'
import { map, mergeMap } from 'rxjs'

import { AuthService } from './auth.service'
import { SignUpDto, SingInDto } from './dto'
import { GoogleGuard } from './guards/google.guard'
import { GoogleUser, Tokens } from './interfaces'

const REFRESH_TOKEN = 'refreshtoken'
@Public()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
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

  @Get('signout')
  @ApiOkResponse({ description: 'Logout successful' })
  async signout(@Cookie(REFRESH_TOKEN) refreshTokens: string, @Res() res: Response) {
    if (!refreshTokens) {
      res.sendStatus(HttpStatus.OK)
      return
    }
    await this.authService.deleteRefreshToken(refreshTokens)
    res.cookie(REFRESH_TOKEN, '', { httpOnly: true, secure: true, expires: new Date() })
    res.sendStatus(HttpStatus.OK)
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

  @UseGuards(GoogleGuard)
  @Get('google')
  @ApiOkResponse()
  googleAuth() {}

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  @ApiOkResponse()
  googleAuthCallback(@Req() req: Request & { user?: GoogleUser }, @Res() res: Response) {
    const token = req.user ? req.user['accessToken'] : null
    return res.redirect(`http://localhost:5000/auth/success?token=${token}`)
  }

  @Get('success') //для проверки на фронте
  @ApiOkResponse()
  success(@Query('token') token: string, @UserAgent() agent: string, @Res() res: Response) {
    return this.httpService.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`).pipe(
      mergeMap(({ data: { email } }) => this.authService.googleAuth(email, agent)),
      map(data => this.setRefreshTokenToCookies(data, res)),
      handleTimeoutAndErrors()
    )
  }
}
