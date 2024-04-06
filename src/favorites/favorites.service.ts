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
    const currentUser = await this.getCurrentUser(user)

    const favorites = await this.prismaService.nannyUserFavorite.findMany({
      where: { userId: currentUser.id },
      include: { nanny: true }
    })
    return favorites.map(favorite => favorite.nanny)
  }

  async getById(nannyId: number, user: JwtPayload): Promise<Nanny> {
    await this.getCurrentUser(user)
    const nanny = await this.findNannyById(nannyId)
    return nanny
  }

  async toggleFavorite(user: JwtPayload, nannyId: number): Promise<Nanny[]> {
    const currentUser = await this.getCurrentUser(user)
    await this.findNannyById(nannyId)

    const favorite = await this.prismaService.nannyUserFavorite.findFirst({
      where: { userId: currentUser.id, nannyId }
    })

    if (favorite) {
      await this.prismaService.nannyUserFavorite.delete({ where: { id: favorite.id } })
    } else {
      await this.prismaService.nannyUserFavorite.create({ data: { nannyId, userId: currentUser.id } })
    }
    return await this.getAll(user)
  }

  private async getCurrentUser(user: JwtPayload) {
    const currentUser = await this.userService.findOne(user.id)

    if (!currentUser) {
      throw new NotFoundException('User not found')
    }
    return currentUser
  }

  private async findNannyById(nannyId: number) {
    const nanny = await this.nanniesService.findById(nannyId)

    if (!nanny) {
      throw new NotFoundException('Nanny not found')
    }
    return nanny
  }
}
