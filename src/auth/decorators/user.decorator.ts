import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if(!request.user){
        throw new InternalServerErrorException('User Not Found in request (Auth Guard activate)')
    }

    return request.user
  }
);