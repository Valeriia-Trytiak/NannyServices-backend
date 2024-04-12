import { Module } from '@nestjs/common'

import { UserModule } from '@user/user.module'

import { AppointmentController } from './appointment.controller'
import { AppointmentService } from './appointment.service'

@Module({
  imports: [UserModule],
  providers: [AppointmentService],
  controllers: [AppointmentController]
})
export class AppointmentModule {}
