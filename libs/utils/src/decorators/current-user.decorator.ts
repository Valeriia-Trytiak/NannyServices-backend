import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { JwtPayload } from '@auth/interfaces'

export const CurrentUser = createParamDecorator(
  (key: keyof JwtPayload, context: ExecutionContext): JwtPayload | Partial<JwtPayload> => {
    const request = context.switchToHttp().getRequest()
    return request.user
  }
)
