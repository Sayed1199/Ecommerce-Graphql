import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Entity, EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { LoggerService } from 'src/logger/logger.service';
import { Otp } from 'src/otps/entities/otp.entity';
import { OtpsService } from '../otps/otps.service';
import { CreateOrUpdateOtpInput } from 'src/otps/dto/create.dto';
import { CreateRandom4Digits } from 'src/common/helpers/randoms.utils';
import { UserResponseInterface } from './interfaces/user-response.interface';
import * as bcrypt from 'bcrypt';
import { AuthenticatedUserResponseInterface } from './interfaces/authenticated-user-response.interface';
import { JwtService } from '@nestjs/jwt';
import { Bindings } from './interfaces/binding-class';
import { PersonalAccessToken } from './entities/token.entity';
import { CreateTokenInput } from './dto/create-token.dto';
import { ChangePasswordRes } from './interfaces/change-password-res.interface';
import { SocketGateway } from '../socket/socket.gateway';

dotenv.config()
@Injectable()
export class UsersService {
  constructor( 
    @InjectRepository(User) private readonly usersRepository : Repository<User>, 
    @InjectRepository(PersonalAccessToken) private readonly personalAccessTokenRepository : Repository<PersonalAccessToken>,
    private readonly mailService : MailerService,
    private readonly configService : ConfigService,
    private readonly loggerService : LoggerService,
    private readonly otpsService : OtpsService, 
    private jwtService : JwtService,
    private socketService : SocketGateway
    
  ){}   

  async create(createUserInput: CreateUserInput) : Promise<User> {
    try {
      var otp = CreateRandom4Digits();
      var hashedPassword = await bcrypt.hash(createUserInput.password,10);
      createUserInput.password = hashedPassword;

      const user = this.usersRepository.create(createUserInput);
      await this.usersRepository.save(user);

      if(!user){
        throw new InternalServerErrorException({message:"Failed to create and save user"});
      }

      var createOtpData = new CreateOrUpdateOtpInput();
      createOtpData.otp = otp;
      createOtpData.userID = user.id;

      var hasSavedOtp = await this.otpsService.upSertOtp(createOtpData);

      if(!hasSavedOtp){
       throw new InternalServerErrorException({message:"Failed to create and save otp"});
      }

      var hasSentMail : boolean = await this.sendEmail(
        `Your OTP Verification CODE IS: ${otp}`,
        "Otp Verification",
        `Sayed 😒 <${this.configService.get<string>("EMAIL_USER")}>`,
        user.email
      );

      if(!hasSentMail){
        throw new InternalServerErrorException({message:"Failed to Send OTP Mail"});
      }
      return user

    } catch (error) {
      this.loggerService.error(error.message,error);
      throw error 
    }
  }

  async findUserByID(id: string) : Promise<UserResponseInterface>{
    try {
      
      const user = await this.usersRepository.findOne({where:{id}});
      if(!user){
        throw new NotFoundException({message:`Couldn't find a user with id: '${id}' `});
      }

      var userResponse : UserResponseInterface = this.handleUserResponse(user);
      return userResponse;

    } catch (error) {
      console.log("Err: "+error)
      this.loggerService.error(error.message,error);
      throw error;
      
    }
    
  }

  async findUserByEmail(email: string) : Promise<UserResponseInterface>{
    try {
      
      const user = await this.usersRepository.findOne({where:{email}});
      if(!user){
        throw new NotFoundException({message:`Couldn't find a user with Email: '${email}' `});
      }

      var userResponse : UserResponseInterface = this.handleUserResponse(user);
      return userResponse;

    } catch (error) {
      console.log("Err: "+error)
      this.loggerService.error(error.message,error);
      throw error;
      
    }
    
  }

  async login(email: string,password:string) : Promise<AuthenticatedUserResponseInterface>{

    try {
        const userResponse : UserResponseInterface = await this.findUserByEmail(email);
        if(!userResponse){
            throw new NotFoundException({message:"This email doesn't exist"});
        } 
        if(!userResponse.user){
            throw new NotFoundException({message:"This email doesn't exist"});
        }

        const doesPasswordMatch : boolean = await bcrypt.compare(password,userResponse.user.password);
        if(!doesPasswordMatch){
            throw new UnprocessableEntityException({message:"Invalid Credentials"});
        }

        const payload = {id:userResponse.user.id,email:userResponse.user.email,name:userResponse.user.name,isAdmin:userResponse.user.isAdmin};

        const token = await this.jwtService.signAsync(payload);

        const createTokenInput : CreateTokenInput = new CreateTokenInput(); 
        createTokenInput.token = token;
        createTokenInput.user = userResponse.user;

        var hasInsertedToken : boolean = await this.insertToken(createTokenInput)

        if(!hasInsertedToken){
          throw new InternalServerErrorException({message :"Couldn't save token for this user"})
        }

        var authenticatedUser : AuthenticatedUserResponseInterface = new AuthenticatedUserResponseInterface();
        authenticatedUser.token = token;
        authenticatedUser.user = userResponse.user;
        authenticatedUser.bindings=userResponse.bindings;

        return authenticatedUser;

    } catch (error) {
        console.log(error)
        this.loggerService.error(error.message,error);
        throw error;
    }
    

  }
 
  async logout(id: string, token: string) : Promise<boolean>{
    try {
      
      await this.personalAccessTokenRepository.delete({userId: id,token})
      return true;

    } catch (error) {
      this.loggerService.error(error.message,error);
      return false;
    }
  }

  async changePassword(id: string,newPassword:string) : Promise<ChangePasswordRes>{

    try {
      const user = await this.usersRepository.findOne({where: {id}})
      var {password,...remainders} = user;
      var isTheSamePassword = await bcrypt.compare(newPassword,password);
      if(isTheSamePassword){
        throw new InternalServerErrorException({message:'This password is currently used for your account, please change the password and try again.'})
      }

      const hashedNewPassword = await bcrypt.hash(newPassword,10);
      const newUser = {password:hashedNewPassword,...remainders};
      await this.usersRepository.update(id,newUser);
      var resObj :  ChangePasswordRes = {
        success: true,
      };
      return resObj;
    } catch (error) {
      console.log(error)
      this.loggerService.error(error.message,error);
      var resObj :  ChangePasswordRes = {
        success: false,
        message:error.message
      };
      return resObj;
    }
    


  }

  async resendOTP(id: string, email: string) : Promise<boolean>{

    try {
      var createOrUpdateotp : CreateOrUpdateOtpInput = new CreateOrUpdateOtpInput();
      var otp = CreateRandom4Digits();
      createOrUpdateotp.otp = otp;
      
      createOrUpdateotp.userID = id; 

      var hasSentOtp: boolean = await this.otpsService.upSertOtp(createOrUpdateotp)

      if(!hasSentOtp){
        throw new InternalServerErrorException({message:"Failed to update otp."})
      }

      var hasSentMail : boolean = await this.sendEmail( 
        `Your OTP Verification CODE IS: ${otp}`,
        "Otp Verification",
        `Sayed 😒 <${this.configService.get<string>("EMAIL_USER")}>`,
        email
      );

      if(!hasSentMail){
        throw new InternalServerErrorException({message:"Failed to send email."})
      }

      return true;

    } catch (error) {
      console.log(error)
      this.loggerService.error(error.message,error)
      throw error;
    }

  }

  async confirmOTP(id: string, otp: number) : Promise<boolean>{
    var isValid : boolean = await this.otpsService.checkIfOTPIsValid(otp,id);
    if(isValid){
      const user = await this.usersRepository.findOne({where:{id}});
      const {emailVerifiedAt,...remainders} = user;
      const updateTime = new Date().toISOString();
      await this.usersRepository.update(id,{emailVerifiedAt:updateTime,...remainders})
    }
    return isValid;
  } 

  async deleteUser(id: string): Promise<boolean>{

    try {
      
      await this.usersRepository.softDelete(id);
      return true;

    } catch (error) {
      console.log(error)
      this.loggerService.error(error.message,error);
      throw error;
    }

  }


   test(){

    // this.socketService.handleSendCreateCategoryEvent({test:"Asdsadsadsa"})

  }


  async insertToken(createTokenInput:CreateTokenInput) : Promise<boolean>{
    try {
        var tokenObj = await this.personalAccessTokenRepository.create(createTokenInput);
        await this.personalAccessTokenRepository.save(tokenObj);
        return true;
    } catch (error) {
        this.loggerService.error(error.message,error)
        return false;
    }
  }

  async doesTokenExist(userId : string) : Promise<boolean>{
    try {
        const tokenDataList = await this.personalAccessTokenRepository.find({
            where:{
              userId
            }
        }) 
        if(!tokenDataList){ 
            throw `This User id doesn't exist`
        }
        if(tokenDataList.length == 0){
           throw `This token doesn't exist`
        }
        return true;
    } catch (error) {
        return false;
    }
  }


 
  handleUserResponse(user: User){
    var userResponse : UserResponseInterface = new UserResponseInterface();
    userResponse.user = user;
    userResponse.bindings = new Bindings();
    userResponse.bindings.isActive = user.isActive == true? true : false;
    userResponse.bindings.isVerified = user.emailVerifiedAt == null? false : true;

    return userResponse;

  }


  async sendEmail(message: string,subject:string,from:string,to:string,) : Promise<boolean>{
    try {
      var info : SentMessageInfo = await this.mailService.sendMail({
        from,
        to,
        subject,
        text:message
      });
  
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }

}
