import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsNumber, MaxLength, Min, MinLength } from "class-validator";

@InputType("ProductInput")

export class ProductInput{


    @Field()
    @MinLength(3)
    @MaxLength(50)
    name: string

    @Field()
    @IsNumber()
    @Min(1)
    price:number

    @Field()
    @IsNotEmpty()
    description : string

    @Field()
    @IsInt()
    stockQuantity:number

    @Field({nullable: true})
    categoryId?: number


}