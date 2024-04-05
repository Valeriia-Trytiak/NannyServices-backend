import { Module } from '@nestjs/common'

import { NanniesModule } from '@nannies/nannies.module'
import { UserModule } from '@user/user.module'

import { FavoritesController } from './favorites.controller'
import { FavoritesService } from './favorites.service'

@Module({
  imports: [UserModule, NanniesModule],
  providers: [FavoritesService],
  controllers: [FavoritesController]
})
export class FavoritesModule {}
