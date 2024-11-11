import { Field, InputType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";

@InputType()
export class EmailInput{
    
  @Field(() => String, { description: 'Bolesa User Email' })
  @IsEmail()
  email: string;

}