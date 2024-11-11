import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';
import * as dotenv from 'dotenv';
import { LoggerService } from 'src/logger/logger.service';
import { CreateOrUpdateOtpInput } from './dto/create.dto';
import { User } from 'src/users/entities/user.entity';

dotenv.config()

@Injectable()
export class OtpsService {
    constructor(
        @InjectRepository(Otp) private readonly otpsReposiroty : Repository<Otp>,
        private loggerService : LoggerService
    ){}

    async upSertOtp(createOrUpdateOtp:CreateOrUpdateOtpInput) : Promise<boolean>{

        try {
            
            await this.otpsReposiroty.upsert(createOrUpdateOtp,["userID"]);  

            return true;

        } catch (error) {
            console.log(error)
            this.loggerService.error(error.message,error);
            return false;
        }

    }
 
    async checkIfOTPIsValid(otp : number, userID: string) : Promise<boolean>{
        try {
            console.log(userID)
            var data = await this.otpsReposiroty.findOne({where:{userID,otp:otp}})
            if(!data){ 
                throw new BadRequestException({message:"Invalid OTP"});
            }
            return true;
        } catch (error) {
            console.log(error)
            throw error;
        } 
    }

}
