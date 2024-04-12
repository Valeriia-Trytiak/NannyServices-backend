import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'

import { AppointmentModule } from './appointment/appointment.module'
import { AuthModule } from './auth/auth.module'
import { FavoritesModule } from './favorites/favorites.module'
import { NanniesModule } from './nannies/nannies.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserController } from './user/user.controller'
import { UserModule } from './user/user.module'
import { UserService } from './user/user.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register(),
    NanniesModule,
    FavoritesModule,
    AppointmentModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    UserService
  ],
  controllers: [UserController],
  exports: [UserService]
})
export class AppModule {}
