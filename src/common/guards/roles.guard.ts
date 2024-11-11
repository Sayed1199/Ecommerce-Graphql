import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { get } from "http";
import { Observable } from "rxjs";

@Injectable() 
export class AdminRoleGuard implements CanActivate{ 

    constructor(
        private reflector : Reflector,
        private jwtService: JwtService, 
    ){}

    getRequest(context: ExecutionContext) : Request {
        const ctx = GqlExecutionContext.create(context);
        var myReq = ctx.getContext().req;
        return myReq;
    }

    private extractTokenFromHeader(request : Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    

    async canActivate(context: ExecutionContext):  Promise<boolean> {
      const req = this.getRequest(context);

      const token = this.extractTokenFromHeader(req);
      if (!token) {
          throw new UnauthorizedException(); 
      }

      const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET_KEY});
      console.log(payload)
        if(payload.isAdmin === true){
            return true;
        }
        return false;
        }

    

}