import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { JwtPayload } from '@auth/interfaces'
import { Nanny, Role } from '@prisma/client'
import { PrismaService } from '@prisma/prisma.service'

import { CreateNannyDto, UpdateNannyDto } from './dto'

@Injectable()
export class NanniesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(page: number, pageSize: number): Promise<Nanny[]> {
    const skip = (page - 1) * pageSize
    return this.prismaService.nanny.findMany({ skip, take: pageSize })
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
  async findAllWithSort(sort: string, page: number, pageSize: number): Promise<Nanny[]> {
    switch (sort) {
      case 'alphabetAsc':
        return this.prismaService.nanny.findMany({
          orderBy: { name: 'asc' },
          skip: (page - 1) * pageSize,
          take: pageSize
        })
      case 'alphabetDesc':
        return this.prismaService.nanny.findMany({
          orderBy: { name: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize
        })
      case 'priceAsc':
        return this.prismaService.nanny.findMany({
          orderBy: { pricePerHour: 'asc' },
          skip: (page - 1) * pageSize,
          take: pageSize
        })
      case 'priceDesc':
        return this.prismaService.nanny.findMany({
          orderBy: { pricePerHour: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize
        })
      case 'ratingAsc':
        return this.prismaService.nanny.findMany({
          orderBy: { rating: 'asc' },
          skip: (page - 1) * pageSize,
          take: pageSize
        })
      case 'ratingDesc':
        return this.prismaService.nanny.findMany({
          orderBy: { rating: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize
        })
      default:
        return this.findAll(page, pageSize)
    }
  }
}
