import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { User } from "src/users/entities/user.entity";

@InputType()
export class CreateTokenInput{

    @Field(()=>String,{description:"Jwt Token",nullable: false})
    @IsNotEmpty()
    token: string


    @Field(()=> User) 
    user: User 

}