import { Controller, Get, Post, Inject, Body } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { catchError } from 'rxjs';


@Controller('auth')
export class AuthController{

    constructor(
        @Inject(NATS_SERVICE) private readonly client:ClientProxy
    ){}

    @Post('register')
    registerUser(@Body()registerUser:RegisterUserDto){
        return this.client.send('auth.register.user',registerUser).pipe(
            catchError(error=>{throw new RpcException(error)})
        )
    }
    
    @Post('login')
    loginUser(@Body() loginDto:LoginDto){
        return this.client.send('auth.login.user',loginDto).pipe(
            catchError(error=>{throw new RpcException(error)})
        )        
    }
    
    @Get('verify')
    verifyToken(){
        return this.client.send('auth.verify.user',{}).pipe(
            catchError(error=>{throw new RpcException(error)})
        )  
    }

}