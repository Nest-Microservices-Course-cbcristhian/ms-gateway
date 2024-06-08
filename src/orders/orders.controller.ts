import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, HttpStatus, Query, Patch } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ORDER_SERVICE } from '../config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../common/dto/pagination.dto';
import { StatusDto } from './dto/status.dto';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient:ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder',createOrderDto)
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto) {
    return this.ordersClient.send('findAllOrders',{})
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto:StatusDto,
    @Query() paginationDto:PaginationDto
    ) {
      try {
        return this.ordersClient.send('findAllOrders',{
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
        this.ordersClient.send('findOneOrder',{id})
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
      return this.ordersClient.send('changeOrderStatus',{id,status:statusDto.status})
    } catch (error) {
      throw new RpcException(error)
    }
  }
}
