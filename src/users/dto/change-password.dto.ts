import { Field, InputType } from "@nestjs/graphql";
import { IsStrongPassword } from "class-validator";

@InputType()
export class ChangePasswordInput{
    @Field(() => String, { description: 'New User Password' })
    @IsStrongPassword()
    newPassword: string;
}