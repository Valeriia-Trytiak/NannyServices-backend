import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from '@user/user.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { options } from './config'
import { GUARDS } from './guards'
import { GoogleGuard } from './guards/google.guard'
import { GoogleStrategy, JwtStrategy } from './strategies'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, ...GUARDS, GoogleGuard],
  imports: [PassportModule, JwtModule.registerAsync(options()), UserModule, HttpModule]
})
export class AuthModule {}
