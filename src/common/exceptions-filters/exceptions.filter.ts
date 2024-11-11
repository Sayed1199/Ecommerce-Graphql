import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { GqlExceptionFilter, GqlExecutionContext } from "@nestjs/graphql";
import { GraphQLError } from "graphql";

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter implements GqlExceptionFilter{
    catch(exception: any, host: ArgumentsHost) : void {
        
        switch(host.getType() as string){
            case 'http':
                super.catch(exception,host);
                return;

            case 'graphql':
                console.log(exception.message)
                if(!exception.type){
                    exception.type = exception.constructor?.name || exception.message;
                }
                if (!exception.code) {
					exception.code = exception.status;
				}
				return exception; 
            
            default:
                super.catch(exception, host);
				return;           
        }
             
    }
    

}