import { Injectable } from '@nestjs/common'

import { User } from '@prisma/client'
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

  findOne(idOrEmail: string) {
    return this.prismaService.user.findFirst({ where: { OR: [{ id: idOrEmail }, { email: idOrEmail }] } })
  }

  remove(id: string) {
    return this.prismaService.user.delete({ where: { id } })
  }
  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10))
  }
}
