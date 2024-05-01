import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCT_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../common/dto/pagination.dto';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({cmd:'create_product'},createProductDto).pipe(
      catchError(error=>{throw new RpcException(error)})
    )
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto){
    try {
      return this.productsClient.send({cmd:'find_all_product'},paginationDto)
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    return this.productsClient.send({cmd:'find_one_product'},{id}).pipe(
      catchError(error=>{throw new RpcException(error)})
    )
/*     try {
      const product = await firstValueFrom(this.productsClient.send({cmd:'find_one_product'},{id}))
      return product
    } catch (error) {
      throw new BadRequestException(error)
    } */
  }

  @Patch(':id')
  update(@Param('id',ParseIntPipe)  id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({cmd:'update_product'},{id,...updateProductDto}).pipe(
      catchError(error=>{throw new RpcException(error)})
    )
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.productsClient.send({cmd:'delete_product'},{id}).pipe(
      catchError(error=>{throw new RpcException(error)})
    )
  }
}
