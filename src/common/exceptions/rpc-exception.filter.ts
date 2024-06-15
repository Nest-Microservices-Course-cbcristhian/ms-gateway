import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx= host.switchToHttp();
    const response= ctx.getResponse();

    const rcpError= exception.getError();

    if(rcpError.toString().includes('Empty response')){
      return response.status(500).json({
        status:500,
        message: rcpError.toString().substring(0,rcpError.toString().indexOf('(')-1)
      })
    }

    if(typeof rcpError === 'object' && 'status' in rcpError && 'message' in rcpError){
        const status=isNaN(+rcpError.status) ? 400 : +rcpError.status
        return response.status(status).json(rcpError)
    }

    response.status(400).json({
        status:400,
        message:rcpError
    })
  }
}