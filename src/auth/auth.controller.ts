import { Controller, Get, Post, Inject, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController{

    constructor(
        @Inject(NATS_SERVICE) private readonly client:ClientProxy
    ){}

    @Post('register')
    registerUser(@Body()registerUser:RegisterUserDto){
        this.client.send('auth.register.user',registerUser)
    }
    
    @Post('login')
    loginUser(@Body() loginDto:LoginDto){
        this.client.send('auth.login.user',loginDto)
        
    }
    
    @Get('verify')
    verifyToken(){
        this.client.send('auth.verify.user',{})

    }

}