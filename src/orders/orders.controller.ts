import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, HttpStatus, Query, Patch } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE, NATS_SERVICE } from '../config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../common/dto/pagination.dto';
import { StatusDto } from './dto/status.dto';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client:ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder',createOrderDto)
  }

  @Get()
  async findAll(@Query() paginationDto:PaginationDto) {
    try {
      const orders= await firstValueFrom(
        this.client.send('findAllOrders',{})
      ) 
      return orders
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto:StatusDto,
    @Query() paginationDto:PaginationDto
    ) {
      try {
        return this.client.send('findAllOrders',{
          ...paginationDto,
          status:statusDto.status
        })
      } catch (error) {
        throw new RpcException(error)
      }
  }

  @Get('id/:id')
  async findOne(@Param('id',ParseUUIDPipe) id: string) {
    try {
      const order= await firstValueFrom(
        this.client.send('findOneOrder',{id})
      )
      return order
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Patch(':id')
  changeStatus( 
    @Param('id') id:string,
    @Body() statusDto:StatusDto,
  ){
    try {
      return this.client.send('changeOrderStatus',{id,status:statusDto.status})
    } catch (error) {
      throw new RpcException(error)
    }
  }
}
