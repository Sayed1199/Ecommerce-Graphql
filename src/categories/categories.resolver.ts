import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { AdminRoleGuard } from 'src/common/guards/roles.guard';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './entities/dto/create-category.dto';
import { ExceptionsFilter } from 'src/common/exceptions-filters/exceptions.filter';
import { query } from 'express';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { PaginatedResponse } from 'src/common/dto/paginated-response.dto';
import { PaginateInput } from 'src/common/dto/pagination-input.dto';
import { GraphQLJSONObject } from 'graphql-type-json';

@Resolver(()=>Category)
@UseFilters(ExceptionsFilter)  
@UseGuards(JwtAuthGuard)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AdminRoleGuard)
  @Mutation(()=>Category)
  async createCategory(
    @Context() context: any, 
    @Args({name:"categoryCreateInput",type:()=>CreateCategoryInput}) createCategoryInput : CreateCategoryInput
  ){
    var createdCategory : Category = await this.categoriesService.createCategory(createCategoryInput);
    return createdCategory
  }

  @UseGuards(AdminRoleGuard)
  @Mutation(()=>Category)
  async updateCategory(
    @Context() context: any, 
    @Args({name:"CategoryInput",type:()=>CreateCategoryInput}) createCategoryInput : CreateCategoryInput,
    @Args({name:"id",type:()=>Number}) id : number,
  ){
    var createdCategory : Category = await this.categoriesService.updateCategory(createCategoryInput,id);
    return createdCategory
  }

  @Query(()=>Category)
  async findCategoryByID(
    @Context() context: any, 
    @Args({name:"id",type:()=>Number}) id : number,
  ){
    var category : Category = await this.categoriesService.findCategoryByID(id);
    return category
  }

  @Query(()=>GraphQLJSONObject)
  async findCategoriesPaginated(
    @Context() context: any, 
    @Args('paginate') paginate: PaginateInput,
  ) : Promise<Object>{
    
    var query : PaginateQuery = {
      page:paginate.page,
      limit:paginate.limit,
      sortBy: paginate.sortBy,
      // searchBy:paginate.searchBy,
      search:paginate.search,
      // filter:paginate.filter,
      select:paginate.select,
      path:""
    };
    var data : Paginated<Category> = await this.categoriesService.findAllCategoriesPaginated(query);

    console.log(data.links.current)

    return {
      items: data.data,
      itemsPerPage: data.meta.itemsPerPage,
      totalItems: data.meta.totalItems,
      currentPage:data.meta.currentPage,
      totalPages: data.meta.totalPages,
    }
  }

  
  @UseGuards(AdminRoleGuard)
  @Mutation(()=>String)
  async deleteCategory(
    @Context() context : any,
    @Args({name:"id",type:()=>Number}) id : number,
  ) : Promise<string>{
    const category = await this.categoriesService.deleteCategory(id);
    if(category){
      return `The Category with name: '${category.name}' and id: '${category.id}' is deleted successfully.`
    }
    return "Something wrong happened, please try again."
  }
  


}
