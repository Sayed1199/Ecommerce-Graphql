import { Field, InterfaceType, ObjectType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { Bindings } from "./binding-class";

@ObjectType()
export class AuthenticatedUserResponseInterface{

    @Field(()=>String)
    token:string

    @Field(()=>User)
    user: User

    @Field(()=>Bindings) 
    bindings: Bindings
}

