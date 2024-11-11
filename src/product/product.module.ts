import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoriesModule } from 'src/categories/categories.module';
import { UsersModule } from 'src/users/users.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Product]),
    LoggerModule.register("Product"),
    CategoriesModule,
    UsersModule,
    SocketModule
  ],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
