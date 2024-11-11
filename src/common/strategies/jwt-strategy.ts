import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { UserResponseInterface } from "src/users/interfaces/user-response.interface";
import * as dotenv from 'dotenv';
import { OtpsService } from "src/otps/otps.service";

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly usersService : UsersService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, 
            secretOrKey: process.env.JWT_SECRET_KEY, 
        });
    }

    async validate(payload){
        if(!payload){
            throw new UnauthorizedException({message:"Access Denied"});
        }
        const userResponseInterface : UserResponseInterface = await this.usersService.findUserByID(payload.id);
        if(!userResponseInterface){
            throw new UnauthorizedException({message:"Access Denied"});
        }
        if(!userResponseInterface.user){
            throw new UnauthorizedException({message:"Access Denied"});
        }

        /// check does otp exist
        



        return userResponseInterface;

    }
}