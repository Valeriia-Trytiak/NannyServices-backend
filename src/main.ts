import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import * as cookieParser from 'cookie-parser'

import { AppModule } from './app.module'

async function bootstrap() {
  const PORT = process.env.PORT || 5000
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  // const reflector = app.get(Reflector)
  // app.useGlobalGuards(new JwtAuthGuard(reflector))
  await app.listen(PORT)
}
bootstrap()
