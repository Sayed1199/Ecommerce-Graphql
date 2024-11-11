import { Resolver, Query, Mutation, Args, Int, Field, InterfaceType, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { BadRequestException, UseFilters, UseGuards } from '@nestjs/common';
import { ExceptionsFilter } from 'src/common/exceptions-filters/exceptions.filter';
import { UserResponseInterface } from './interfaces/user-response.interface';
import { AuthenticatedUserResponseInterface } from './interfaces/authenticated-user-response.interface';
import { LoginUserInput } from './dto/login-user-input';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ChangePasswordInput } from './dto/change-password.dto';
import { ChangePasswordRes } from './interfaces/change-password-res.interface';
import { EmailInput } from './dto/email-input.dto';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AdminRoleGuard } from 'src/common/guards/roles.guard';

@Resolver(() => User)
@UseFilters(ExceptionsFilter)  
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User, {nullable: false})
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) : Promise<User> {
    return await this.usersService.create(createUserInput);  
  }

  @Mutation(()=>AuthenticatedUserResponseInterface)
  async login(
    @Args({name:"loginInput",nullable: false,type: () => LoginUserInput,}) loginUserInput: LoginUserInput,
  ){
    return await this.usersService.login(loginUserInput.email,loginUserInput.password);
  }


  
  @UseGuards(JwtAuthGuard)
  @Query( ()=> UserResponseInterface)
  async findUser(
    @Args({name:"id",nullable: true,type: () => String,}) id: string | null,
    @Args({name:"email",nullable: true,type: () => String,}) email: string | null,
  ) : Promise<UserResponseInterface>{
    if(id == null && email == null){
      throw new BadRequestException({message:"One of the two arguments (id,email) is required."});
    }
    if(id != null){
      return await this.usersService.findUserByID(id);
    }
    if(email != null){
      return await this.usersService.findUserByEmail(email);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(()=>String)
  async logout(@Context() context: any) : Promise<string>{
    const {req} = context;
    var hasSignedOut : boolean = await this.usersService.logout(req.user.id,req.token);
    if(hasSignedOut){
      return "User Logged out successfully."
    }
    return "something wrong happened, please try again."
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(()=>String)
  async changePassword(
    @Context() context: any,
    @Args({name:"newPassword",nullable: false,type: () => ChangePasswordInput,}) changePasswordInput : ChangePasswordInput
  ):Promise<string>{
    const {req} = context;
    const resObject : ChangePasswordRes = await this.usersService.changePassword(req.user.id,changePasswordInput.newPassword)

    if(resObject.success === true){
      return "User's password was changed successfully."
    }
    return resObject.message; 

  }

  @UseGuards(JwtAuthGuard)
  @Mutation(()=>String)
  async resendOTP(
    @Context() context: any,
  ):Promise<string>{
    const {req} = context;
    const hasSentOTP : boolean = await this.usersService.resendOTP(req.user.id, req.user.email) 

    if(hasSentOTP){
      return `An OTP has been resent to your email '${req.user.email}' `
    }
    return "Failed to send otp, please try again"; 

  }

  @UseGuards(JwtAuthGuard)
  @Mutation(()=>String)
  async deleteUser(
    @Context() context: any,
  ):Promise<string>{
    const {req} = context;
    const hasDeletedUser : boolean = await this.usersService.deleteUser(req.user.id) 

    if(hasDeletedUser){
      return `Account deleted successfully.`
    }
    return "Failed to delete account, please try again"; 

  }

  @UseGuards(JwtAuthGuard)
  @Mutation(()=>String)
  async confirmOTP(
    @Context() context: any,
    @Args({name:"otp",nullable: false,type: () => Number,}) otp : number
  ):Promise<string>{
    const {req} = context;
    const isOTPValid : boolean = await this.usersService.confirmOTP(req.user.id,otp) 
    if(isOTPValid){
      return "Account Verified Successfully."
    }
    return "Something wrong happened, please try again."; 

  }

  @Query(()=>String)
  test(){
    this.usersService.test();
    return "";
  }



}
