import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class Bindings{
    @Field(()=>Boolean)
    isActive: boolean;
    @Field(()=>Boolean)
    isVerified: boolean
}
