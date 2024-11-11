import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductInput } from './dto/create-product.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { LoggerService } from '../logger/logger.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product) private productsRepository : Repository<Product>,
        private readonly categoryServices : CategoriesService,
        private readonly loggerService : LoggerService,
        private readonly socketService : SocketGateway
    ){}
    

    async createProduct(createProductInput : ProductInput) : Promise<Product>{

        try {
            var category : Category | null = null;
            if(createProductInput.categoryId !== null){
                category = await this.categoryServices.findCategoryByID(createProductInput.categoryId)
            }

            const product = this.productsRepository.create({...createProductInput,category})
            await this.productsRepository.save(product);
            this.socketService.handleCreateProductEvent(product);
            return product;

        } catch (error) {
            console.log(error)
            this.loggerService.error(error.message,error)
            throw error
        }
      
        

    }

    async findProductByID(id: number) : Promise<Product>{
        try {
            
            const product = await this.productsRepository.findOne({where:{id},relations:['category']})
            return product;

        } catch (error) {
            console.log(error)
            this.loggerService.error(error.message,error)
            throw error
        }
    }

    async updateProduct(myId: number, updateProductInput : ProductInput) : Promise<Product>{
        try {
            console.log(updateProductInput.categoryId)
            const product = await this.productsRepository.findOne({where:{id:myId},relations:['category']})
            var oldCat : Category | null = product.category;
            if(updateProductInput.categoryId != product.category?.id){
                if(updateProductInput.categoryId == null){
                    oldCat = null;
                }else{
                    oldCat = await this.categoryServices.findCategoryByID(updateProductInput.categoryId);
                }
            }
            console.log(oldCat)
            const {id,orderItems,createdAt,updatedAt,...remainders} = product;
            const {categoryId,...productInputRemainders} = updateProductInput;
            const updatedProduct = {...productInputRemainders,orderItems,id,createdAt,updatedAt,category:oldCat} ;
            await this.productsRepository.update(id,updatedProduct)

            return updatedProduct;

        } catch (error) {
            console.log(error)
            this.loggerService.error(error.message,error)
            throw error
        }
    } 

    async deleteProduct(id: number) : Promise<Product>{
            try {
                
                const product = await this.findProductByID(id);
                if(!product){
                    throw new NotFoundException({message:`Product with id: '${id}' was not found.`});
                }

                await this.productsRepository.softDelete(id);

                return product;


            } catch (error) {
                console.log(error)
                this.loggerService.error(error.message,error)
                throw error
            }
    }


    async findAllProductsPaginated(query : PaginateQuery) : Promise<Paginated<Product>>{

        try {
            
            return paginate(query,this.productsRepository,{
                sortableColumns:["id","name","description","price","stockQuantity","createdAt"],
                nullSort:"last",
                defaultSortBy: [['id', 'DESC']],
                searchableColumns: ['name', 'description',"price","stockQuantity","id","category.(name","category.(description"],
                select : ["id","name","description","price","stockQuantity","category"],
            });

        } catch (error) {
            console.log(error)
            this.loggerService.error(error.message,error)
            throw error;
        }

    }

}
