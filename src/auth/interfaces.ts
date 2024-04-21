import { Token } from '@prisma/client'

export interface Tokens {
  accessToken: string
  refreshToken: Token
}

export interface JwtPayload {
  id: string
  email: string
  roles: string[]
}

export interface GoogleUser {
  email: string
  firstName: string
  lastName: string
  picture: string
  accessToken: string
}
