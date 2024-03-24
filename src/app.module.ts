import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserController } from './user/user.controller'
import { UserModule } from './user/user.module'
import { UserService } from './user/user.service'

@Module({
  imports: [ConfigModule.forRoot(), UserModule, PrismaModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class AppModule {}
