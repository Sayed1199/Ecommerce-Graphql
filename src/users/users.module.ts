import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { OtpsModule } from 'src/otps/otps.module';
import { PersonalAccessToken } from './entities/token.entity';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports:[  
    TypeOrmModule.forFeature([User,PersonalAccessToken]), 
    LoggerModule.register('User'),
    OtpsModule,
    SocketModule
    ], 
  providers: [UsersResolver, UsersService], 
  exports: [UsersService] 
})
export class UsersModule {}
