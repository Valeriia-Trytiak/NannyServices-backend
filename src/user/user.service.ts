import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { JwtPayload } from '@auth/interfaces'
import { Role, User } from '@prisma/client'
import { PrismaService } from '@prisma/prisma.service'
import { convertToSeconds } from '@utils/utils'
import { genSaltSync, hashSync } from 'bcrypt'
import { Cache } from 'cache-manager'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService
  ) {}

  save(user: Partial<User>) {
    console.log('Данные для создания нового пользователя:', user)
    const hashedPassword = user?.password ? this.hashPassword(user.password) : null
    // const hashedPassword = user.password ? this.hashPassword(user.password) : undefined
    // if (!hashedPassword) {
    //   throw new Error('Password is required')
    // }
    return this.prismaService.user.create({
      data: { name: user.name || '', email: user.email || '', password: hashedPassword, roles: ['USER'] }
    })
  }

  async findOne(idOrEmail: string, isReset = false): Promise<User> {
    if (isReset) {
      await this.cacheManager.del(idOrEmail)
    }
    const user = await this.cacheManager.get<User>(idOrEmail)
    if (!user) {
      const user = await this.prismaService.user.findFirst({
        where: {
          OR: [{ id: idOrEmail }, { email: idOrEmail }]
        }
      })
      if (!user) {
        return {} as User
      }
      await this.cacheManager.set(idOrEmail, user, convertToSeconds(this.configService.get('JWT_EXP', '1h')))
      return user
    }
    return user
  }

  async remove(id: string, user: JwtPayload): Promise<{ id: string }> {
    if (user.id !== id && !user.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException()
    }
    await Promise.all([this.cacheManager.del(id), this.cacheManager.del(user.email)])
    return await this.prismaService.user.delete({ where: { id }, select: { id: true } })
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10))
  }
}
