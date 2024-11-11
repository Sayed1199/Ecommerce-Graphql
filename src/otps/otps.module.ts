import { Module } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { OtpsResolver } from './otps.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Otp]),
    LoggerModule.register('Otp'),
  ],
  providers: [OtpsResolver, OtpsService],
  exports: [OtpsService]
})
export class OtpsModule {}
