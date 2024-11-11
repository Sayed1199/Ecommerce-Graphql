import { Field, InterfaceType, ObjectType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";
import { Bindings } from "./binding-class";

@ObjectType()
export class UserResponseInterface{
    @Field(()=>User)
    user: User;
    @Field(()=>Bindings) 
    bindings: Bindings
}

