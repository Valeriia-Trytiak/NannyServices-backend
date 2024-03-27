import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'

import { JwtPayload } from '@auth/interfaces'
import { Role, User } from '@prisma/client'
import { PrismaService } from '@prisma/prisma.service'
import { genSaltSync, hashSync } from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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
    const user = await this.prismaService.user.findFirst({ where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] } })
    if (!user) {
      throw new UnauthorizedException('User not found')
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
