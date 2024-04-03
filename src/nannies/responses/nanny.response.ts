import { Nanny } from '@prisma/client'
import { Exclude } from 'class-transformer'

export class NannyResponse implements Nanny {
  id: number
  name: string
  avatarUrl: string
  birthday: Date
  experience: string
  education: string
  kidsAge: string
  pricePerHour: number
  location: string
  about: string
  rating: number
  characters: string[]

  @Exclude()
  reviews: string[]

  constructor(nanny: Nanny) {
    Object.assign(this, nanny)
  }
}
