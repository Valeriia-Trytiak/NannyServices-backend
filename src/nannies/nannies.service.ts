import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { JwtPayload } from '@auth/interfaces'
import { Nanny, Role } from '@prisma/client'
import { PrismaService } from '@prisma/prisma.service'

import { CreateNannyDto, UpdateNannyDto } from './dto'

@Injectable()
export class NanniesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Nanny[]> {
    return this.prismaService.nanny.findMany()
  }

  async findById(id: number): Promise<Nanny | null> {
    return this.prismaService.nanny.findUnique({ where: { id } })
  }

  async create(nannyDto: CreateNannyDto, user: JwtPayload): Promise<Nanny> {
    if (!user.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException()
    }
    const existingNanny = await this.prismaService.nanny.findFirst({ where: { name: nannyDto.name } })
    if (existingNanny) {
      throw new BadRequestException('Nanny with the same name already exists')
    }
    return this.prismaService.nanny.create({ data: nannyDto })
  }

  async update(id: number, nannyDto: UpdateNannyDto, user: JwtPayload): Promise<Nanny> {
    if (!user.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException()
    }
    const nanny = await this.prismaService.nanny.findUnique({ where: { id } })
    if (!nanny) {
      throw new NotFoundException('Nanny not found')
    }

    return this.prismaService.nanny.update({ where: { id }, data: nannyDto })
  }

  async remove(id: number, user: JwtPayload): Promise<{ id: number }> {
    const nanny = await this.prismaService.nanny.findUnique({ where: { id } })

    if (!nanny) {
      throw new NotFoundException('Nanny not found')
    }
    if (!user.roles.includes(Role.ADMIN)) {
      throw new ForbiddenException()
    }
    return await this.prismaService.nanny.delete({ where: { id }, select: { id: true } })
  }

  //sort

  async sortByAlphabetAsc(): Promise<Nanny[]> {
    return this.prismaService.nanny.findMany({ orderBy: { name: 'asc' } })
  }

  async sortByAlphabetDesc(): Promise<Nanny[]> {
    return this.prismaService.nanny.findMany({ orderBy: { name: 'desc' } })
  }

  async sortByPriceAsc(): Promise<Nanny[]> {
    return this.prismaService.nanny.findMany({ orderBy: { pricePerHour: 'asc' } })
  }

  async sortByPriceDesc(): Promise<Nanny[]> {
    return this.prismaService.nanny.findMany({ orderBy: { pricePerHour: 'desc' } })
  }

  async sortByRatingAsc(): Promise<Nanny[]> {
    return this.prismaService.nanny.findMany({ orderBy: { rating: 'asc' } })
  }

  async sortByRatingDesc(): Promise<Nanny[]> {
    return this.prismaService.nanny.findMany({ orderBy: { rating: 'desc' } })
  }
}
