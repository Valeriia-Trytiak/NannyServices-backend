import { Injectable, NotFoundException } from '@nestjs/common'

import { JwtPayload } from '@auth/interfaces'
import { NanniesService } from '@nannies/nannies.service'
import { Nanny } from '@prisma/client'
import { PrismaService } from '@prisma/prisma.service'
import { UserService } from '@user/user.service'

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly nanniesService: NanniesService
  ) {}

  async getAll(user: JwtPayload): Promise<Nanny[]> {
    const userId = user.id

    const currentUser = await this.userService.findOne(userId)

    if (!currentUser) {
      throw new NotFoundException('User not found')
    }

    const favorites = await this.prismaService.nannyUserFavorite.findMany({
      where: { userId },
      include: { nanny: true }
    })
    return favorites.map(favorite => favorite.nanny)
  }

  async toggleFavorite(user: JwtPayload, nannyId: number): Promise<Nanny[]> {
    const userId = user.id

    const currentUser = await this.userService.findOne(userId)

    if (!currentUser) {
      throw new NotFoundException('User not found')
    }

    const nanny = await this.nanniesService.findById(nannyId)
    if (!nanny) {
      throw new NotFoundException('Nanny not found')
    }

    const favorite = await this.prismaService.nannyUserFavorite.findFirst({ where: { userId, nannyId } })

    if (favorite) {
      await this.prismaService.nannyUserFavorite.delete({ where: { id: favorite.id } })
    } else {
      await this.prismaService.nannyUserFavorite.create({ data: { nannyId, userId } })
    }
    return await this.getAll(user)
  }
}
