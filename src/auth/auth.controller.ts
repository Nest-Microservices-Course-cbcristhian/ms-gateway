import { Controller, Get, Post, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';


@Controller('auth')
export class AuthController{

    constructor(
        @Inject(NATS_SERVICE) private readonly client:ClientProxy
    ){}

    @Post('register')
    registerUser(){
        this.client.send('auth.register.user',{})
    }
    
    @Post('login')
    loginUser(){
        this.client.send('auth.login.user',{})
        
    }
    
    @Get('verify')
    verifyToken(){
        this.client.send('auth.verify.user',{})

    }

}