import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if(!request.token){
        throw new InternalServerErrorException('Token Not Found in request (Auth Guard activate)')
    }

    return request.token
  }
);