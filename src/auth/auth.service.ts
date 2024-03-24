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
