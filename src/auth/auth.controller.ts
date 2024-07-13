import { Controller, Get, Post, Inject, Body, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators/user.decorator';
import { Token } from './decorators/token.decorator';


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
    @UseGuards(AuthGuard)
    @Get('verify')
    verifyToken(@User() user, @Token()token){
        return {user,token}
    }

}