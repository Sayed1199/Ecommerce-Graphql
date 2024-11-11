import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsEmail, IsOptional, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
 
@InputType()
export class LoginUserInput {

  @Field(() => String, { description: 'User Email' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'User Password' })
  @IsStrongPassword()
  password: string;
}
