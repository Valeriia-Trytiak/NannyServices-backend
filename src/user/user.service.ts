import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { JwtPayload } from '@auth/interfaces'
import { Role, User } from '@prisma/client'
import { PrismaService } from '@prisma/prisma.service'
import { genSaltSync, hashSync } from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService
  ) {}

  save(user: Partial<User>) {
    // const hashedPassword = this.hashPassword(user.password)
    const hashedPassword = user.password ? this.hashPassword(user.password) : undefined
    if (!hashedPassword) {
      throw new Error('Password is required')
    }
    return this.prismaService.user.create({
      data: { name: user.name || '', email: user.email || '', password: hashedPassword, roles: ['USER'] }
    })
  }

  async findOne(idOrEmail: string): Promise<User> {
    const user = await this.cacheManager.get<User>(idOrEmail)
    if (!user) {
      const user = await this.prismaService.user.findFirst({
        where: {
          OR: [{ id: idOrEmail }, { email: idOrEmail }]
        }
      })
      if (!user) {
        return null
      }
      await this.cacheManager.set(idOrEmail, user)
      return user
    }
    return user
  }

  async remove(id: string, user: JwtPayload): Promise<{ id: string }> {
    if (user.id !== id && !user.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException()
    }
    return await this.prismaService.user.delete({ where: { id }, select: { id: true } })
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10))
  }
}
