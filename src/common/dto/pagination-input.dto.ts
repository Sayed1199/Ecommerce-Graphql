import { InputType, Field, Int } from "@nestjs/graphql";
import { IsInt } from "class-validator";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType()
export class PaginateInput {
    @Field(() => Int, { defaultValue: 1 })
    @IsInt()
    page: number;

    @Field(() => Int, { defaultValue: 10 })
    @IsInt()
    limit: number;

    @Field(()=>[[String,String]],{nullable:true})
    sortBy?: [string, string][];
    
    @Field(()=>String,{nullable:true})
    search?: string;
    
    @Field(()=>[String],{nullable:true})
    select?: string[];
}

