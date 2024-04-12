import { Body, Controller, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { JwtPayload } from '@auth/interfaces'
import { CurrentUser } from '@utils/decorators'

import { AppointmentService } from './appointment.service'
import { CreateAppointmentDto } from './dto'

@ApiTags('appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOkResponse()
  @ApiBadRequestResponse()
  async createAppointment(@Body() appointmentDto: CreateAppointmentDto, @CurrentUser() user: JwtPayload) {
    return this.appointmentService.create(appointmentDto, user)
  }
}
