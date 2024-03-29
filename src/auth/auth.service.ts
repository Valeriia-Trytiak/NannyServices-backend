import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
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
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async refreshTokens(refreshToken: string, agent: string): Promise<Tokens> {
    const token = await this.prismaService.token.findUnique({ where: { token: refreshToken } })
    if (!token) {
      throw new UnauthorizedException()
    }
    await this.prismaService.token.delete({ where: { token: refreshToken } })
    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.findOne(token.userId)
    return this.generateTokens(user, agent)
  }

  async signup(dto: SignUpDto) {
    const isUserExists: User = await this.userService.findOne(dto.email, true)
    if (isUserExists) {
      throw new ConflictException('User already exists')
    }

    return this.userService.save(dto)
  }

  async singin(dto: SingInDto, agent: string): Promise<Tokens> {
    const user: User = await this.userService.findOne(dto.email, true)
    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Login or password is incorrect')
    }
    return this.generateTokens(user, agent)
  }

  private async generateTokens(user: User, agent: string): Promise<Tokens> {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        roles: user.roles
      })
    const refreshToken = await this.getRefreshToken(user.id, agent)
    return { accessToken, refreshToken }
  }

  private async getRefreshToken(userId: string, agent: string): Promise<Token> {
    const token = await this.prismaService.token.findFirst({ where: { userId, userAgent: agent } })
    return this.prismaService.token.upsert({
      where: { token: token?.token ?? ' ' },
      update: {
        token: v4(),
        exp: add(new Date(), { months: 1 })
      },
      create: {
        token: v4(),
        exp: add(new Date(), { months: 1 }), //налаштувати через дані оточення
        userId,
        userAgent: agent
      }
    })
  }

  deleteRefreshToken(token: string) {
    return this.prismaService.token.delete({ where: { token } })
  }
}
