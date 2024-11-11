import { ObjectType, Field, Int, HideField } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PersonalAccessToken } from './token.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from '../../payment/entities/payment.entity';

@ObjectType("users")
@Entity("users")
export class User {

  @Field(() => String, { description: 'User ID' })
  @PrimaryGeneratedColumn("uuid") 
  id: string;

  @Field(() => String, { description: 'User Email',nullable:false, }) 
  @Column({nullable: false,unique: true})
  email: string;

  @Field(() => String, { description: 'User Name' })
  @Column({nullable: false,})
  name: string;
  
  // @Field(() => String, { description: 'User Password'}) 
  @Column({nullable: false,})
  // @Exclude({ toPlainOnly: true })
  // @HideField()
  password: string;


  @Field(() => String, { description: 'User Address' })
  @Column({nullable: false,})
  address: string;
  
  @Field(() => String, { description: 'User PhoneNo' })
  @Column({nullable: false,unique: true})
  phoneNo: string;

  @Field(() => Boolean, { description: 'Check if admin' })
  @Column({nullable: false,})
  isAdmin: boolean;
 
  @Field(()=> Boolean)
  @Column({nullable: true, default:false})
  isActive?: boolean | null

  @Field(() => Date, { description: 'Check Email Verification',nullable: true })
  @Column({nullable: true,})
  emailVerifiedAt?: Date | null;

  @Field(()=> Date)
  @CreateDateColumn()
  created_on: Date

  @Field(()=> Date)
  @UpdateDateColumn()
  updated_on: Date

  @DeleteDateColumn({ nullable: true })
  deleted_on: Date | null;
 
  @OneToMany(()=> PersonalAccessToken,personalAccessToken => personalAccessToken.user) 
  peronsalAccessTokens : PersonalAccessToken[]

  @OneToMany(()=>Order, (order)=>order.user)
  orders: Order[]

  @OneToMany(()=>Payment,(payment)=>payment.user)
  payments : Payment[]


}
  