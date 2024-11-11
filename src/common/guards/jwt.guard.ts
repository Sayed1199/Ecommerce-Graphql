import { ExecutionContext, Injectable, Scope, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { UsersService } from '../../users/users.service';
import { UserResponseInterface } from "src/users/interfaces/user-response.interface";

@Injectable() 
export class JwtAuthGuard extends AuthGuard("jwt"){

    constructor(
        private jwtService: JwtService, 
        private usersService : UsersService
    ){ 
        super();
    }


    getRequest(context: ExecutionContext) : Request {
        const ctx = GqlExecutionContext.create(context);
        var myReq = ctx.getContext().req;
        return myReq;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = this.getRequest(context);
        const token = this.extractTokenFromHeader(req);
        if (!token) {
            throw new UnauthorizedException(); 
        }

        try { 
            
            const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET_KEY});

            var doesTokenExist : boolean = await this.usersService.doesTokenExist(payload.id)  
            if(!doesTokenExist){
                throw new UnauthorizedException()
            }

            req.user = payload;
            req['token'] = token; 

            return true;



        } catch (error) {
            console.log(error)
             return false;
        }

    }

    private extractTokenFromHeader(request : Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}