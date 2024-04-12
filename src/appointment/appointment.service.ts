import { Injectable, NotFoundException } from '@nestjs/common'

import { JwtPayload } from '@auth/interfaces'
import { AppointmentResponse } from '@nannies/responses/appointment.response'
import { PrismaService } from '@prisma/prisma.service'
import { UserService } from '@user/user.service'

import { CreateAppointmentDto } from './dto'

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService
  ) {}

  async create(appointmentDto: CreateAppointmentDto, user: JwtPayload): Promise<AppointmentResponse> {
    const currentUser = await this.getCurrentUser(user)

    const createdAppointment = await this.prismaService.appointment.create({
      data: {
        ...appointmentDto,
        userId: currentUser.id,
        status: 'pending'
      }
    })
    return new AppointmentResponse(createdAppointment)
  }

  private async getCurrentUser(user: JwtPayload) {
    const currentUser = await this.userService.findOne(user.id)

    if (!currentUser) {
      throw new NotFoundException('User not found')
    }

    return currentUser
  }
}
