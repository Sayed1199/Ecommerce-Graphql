import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, MaxLength, MinLength } from "class-validator";

@InputType("CategoryInput")
export class CreateCategoryInput{
    @Field({nullable:false,description:"Category name"})
    @MinLength(3)
    @MaxLength(50)
    name: string

    @Field({nullable:true,description:"Category description"})
    @IsOptional()
    description?: string
}