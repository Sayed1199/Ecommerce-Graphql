import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCategoryInput } from './entities/dto/create-category.dto';
import { LoggerService } from '../logger/logger.service';
import { FilterOperator, FilterSuffix, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private categoriesRepository  : Repository<Category>,
        private loggerService : LoggerService,
        private readonly socketService: SocketGateway
    ){}

    async createCategory(createCategoryInput : CreateCategoryInput):Promise<Category>{

        try {
            
            const category =  this.categoriesRepository.create(createCategoryInput)
            await this.categoriesRepository.save(category);
            
            this.socketService.handleSendCreateCategoryEvent(category);

            return category;

        } catch (error) {
            console.log(error)
            this.loggerService.error(error.message,error)
            throw error;
        }

    }

    async updateCategory(createCategoryInput : CreateCategoryInput, id: number) :  Promise<Category>{

        try {
            
            await this.categoriesRepository.find({where:{}})

           const category = await this.categoriesRepository.findOne({where:{id}})
           const {name,description,...remainders} = category;
           const newCategory : Category = {name:createCategoryInput.name,description:createCategoryInput.description,...remainders};
        
           await this.categoriesRepository.update(id,newCategory);

           this.socketService.handleSendUpdateCategoryEvent(newCategory)

           return newCategory

        } catch (error) {
            console.log(error)
            this.loggerService.error(error.message,error)
            throw error;
        }
 
    }

    async findCategoryByID(id: number) : Promise<Category>{
        try {
            
            const category = await this.categoriesRepository.findOneBy({id})
            return category;

        } catch (error) {
            console.log(error)
            this.loggerService.error(error.message,error)
            throw error;
        }
    }

    async findAllCategoriesPaginated(query : PaginateQuery) : Promise<Paginated<Category>>{

        try {
            
            return paginate(query,this.categoriesRepository,{
                sortableColumns:["id","name","description"],
                nullSort:"last",
                defaultSortBy: [['id', 'DESC']],
                searchableColumns: ['name', 'description',],
                select : ['id','name','description','createdAt','updatedAt'],
                filterableColumns: {
                    name: [FilterOperator.EQ],
                }
            });

        } catch (error) {
            console.log(error)
            this.loggerService.error(error.message,error)
            throw error;
        }

    }

    async deleteCategory(id: number): Promise<Category>{

        try {
            
            const category = await this.categoriesRepository.findOneBy({id})
            if(!category){
                throw new NotFoundException({message:`No Category exists for id: ${id}`});
            }

            await this.categoriesRepository.softDelete(id);

            return category;
             

        } catch (error) {
            console.log(error)
            this.loggerService.error(error.message,error)
            throw error;
        }

    }

}
