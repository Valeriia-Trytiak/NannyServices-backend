import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from '@user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { options } from './config'
import { JwtStrategy } from './strategies'

@Module({
  imports: [PassportModule, JwtModule.registerAsync(options()), UserModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
