import { Appointment, AppointmentStatus } from '@prisma/client'
import { Exclude } from 'class-transformer'

export class AppointmentResponse implements Appointment {
  id: number
  nannyId: number
  userId: string
  address: string
  phoneNumber: string
  email: string
  username: string
  time: Date

  @Exclude()
  childAge: string

  @Exclude()
  comment: string

  status: AppointmentStatus
  createdAt: Date

  @Exclude()
  updatedAt: Date

  constructor(apointment: Appointment) {
    Object.assign(this, apointment)
  }
}
