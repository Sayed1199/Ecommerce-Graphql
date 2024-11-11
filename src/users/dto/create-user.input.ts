import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsEmail, IsOptional, IsPhoneNumber, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
 
@InputType()
export class CreateUserInput {

  @Field(() => String, { description: 'User Email' })
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'User Name' })
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @Field(() => String, { description: 'User Password' })
  @IsStrongPassword()
  password: string;


  @Field(() => String, { description: 'User Address' })
  @MinLength(2)
  @MaxLength(150)
  address: string;


  @Field(() => String, { description: 'User PhoneNo' })
  @IsPhoneNumber()
  phoneNo: string;


  @Field(() => Boolean, { description: 'IsAdmin Check' })
  @IsBoolean()
  isAdmin: boolean

}
