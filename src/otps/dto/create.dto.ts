import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNumber, MaxLength, MinLength } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Column, OneToOne, JoinColumn } from "typeorm";

@InputType("CreateOrUpdateOtp")
export class CreateOrUpdateOtpInput{

    @Field(()=>Int,{description:"Otp value",nullable: false})
    @IsNumber()
    @MaxLength(4)
    @MinLength(4)
    otp: number

    @Field(()=> String)
    userID: string  
 
} 