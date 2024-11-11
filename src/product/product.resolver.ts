import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { ExceptionsFilter } from 'src/common/exceptions-filters/exceptions.filter';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { AdminRoleGuard } from 'src/common/guards/roles.guard';
import { ProductInput } from './dto/create-product.dto';
import { GraphQLJSONObject } from 'graphql-type-json';
import { PaginateInput } from 'src/common/dto/pagination-input.dto';
import { Paginated, PaginateQuery } from 'nestjs-paginate';

@UseFilters(ExceptionsFilter)  
@UseGuards(JwtAuthGuard)
@Resolver(()=>Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService
  ) {}

  @UseGuards(AdminRoleGuard)
  @Mutation(()=>Product)
  async createProduct( 
    @Context() context: any, 
    @Args({name:"createProductInput",type:()=>ProductInput}) createProductInput : ProductInput
  ):Promise<Product>{
    var createdProduct : Product = await this.productService.createProduct(createProductInput);
    return createdProduct
  }

  @UseGuards(AdminRoleGuard)
  @Mutation(()=>Product)
  async updateProduct( 
    @Context() context: any, 
    @Args({name:"id",type:()=>Number}) id : number,
    @Args({name:"updateProductInput",type:()=>ProductInput}) updateProductInput : ProductInput
  ):Promise<Product>{
    var updatedProduct : Product = await this.productService.updateProduct(id,updateProductInput);
    return updatedProduct
  }


  @UseGuards(AdminRoleGuard)
  @Mutation(()=>String)
  async deleteProduct( 
    @Context() context: any, 
    @Args({name:"id",type:()=>Number}) id : number,
  ):Promise<string>{
    var deletedProduct : Product = await this.productService.deleteProduct(id);
    if(deletedProduct){
      return `Product with name: '${deletedProduct.name}' and id:'${deletedProduct.id}' was deleted successfully.`;
    }
    return "Something wrong happened, please try again.";
  }


  @Query(()=>Product)
  async findProductById(
    @Context() context: any, 
    @Args({name:"id",type:()=>Number}) id : number
  ): Promise<Product>{

    return await this.productService.findProductByID(id);

  }

  @Query(()=>GraphQLJSONObject)
  async findAllProductPaginated(
    @Context() context: any, 
    @Args('paginate') paginate: PaginateInput,
  ): Promise<Object>{

    var query : PaginateQuery = {
      page:paginate.page,
      limit:paginate.limit,
      sortBy: paginate.sortBy,
      search:paginate.search,
      select:paginate.select,
      path:""
    };
    var data : Paginated<Product> = await this.productService.findAllProductsPaginated(query);

    console.log(data.links.current)

    return { 
      items: data.data,
      itemsPerPage: data.meta.itemsPerPage,
      totalItems: data.meta.totalItems,
      currentPage:data.meta.currentPage,
      totalPages: data.meta.totalPages,
    }

  }
  



}
