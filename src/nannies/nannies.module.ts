import { Module } from '@nestjs/common'

import { NanniesController } from './nannies.controller'
import { NanniesService } from './nannies.service'

@Module({
  providers: [NanniesService],
  controllers: [NanniesController]
})
export class NanniesModule {}
