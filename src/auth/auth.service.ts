import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Token, User } from '@prisma/client'
import { PrismaService } from '@prisma/prisma.service'
import { UserService } from '@user/user.service'
import { compareSync } from 'bcrypt'
import { add } from 'date-fns'
import { v4 } from 'uuid'

import { SignUpDto, SingInDto } from './dto'
import { Tokens } from './interfaces'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    const token = await this.prismaService.token.findUnique({ where: { token: refreshToken } })
    if (!token) {
      throw new UnauthorizedException()
    }
    await this.prismaService.token.delete({ where: { token: refreshToken } })
    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.findOne(token.userId)
    return this.generateTokens(user)
  }

  async signup(dto: SignUpDto) {
    const isUserExists = await this.userService.findOne(dto.email)
    if (isUserExists) {
      throw new ConflictException('User already exists')
    }

    const user = await this.userService.save(dto)
    return user
  }

  async singin(dto: SingInDto): Promise<Tokens> {
    const user: User = await this.userService.findOne(dto.email)
    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Login or password is incorrect')
    }
    return this.generateTokens(user)
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles
      })
    const refreshToken = await this.getRefreshToken(user.id)
    return { accessToken, refreshToken }
  }

  private async getRefreshToken(userId: string): Promise<Token> {
    return this.prismaService.token.create({
      data: {
        token: v4(),
        exp: add(new Date(), { months: 1 }), //налаштувати через дані оточення
        userId
      }
    })
  }
}