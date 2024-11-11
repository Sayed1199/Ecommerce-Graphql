import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("otps")
@ObjectType("Otps")
export class Otp {
    @Field(()=>Int)
    @PrimaryGeneratedColumn()
    id: number

    @Field(()=>Int,{description:"Otp value",nullable: false})
    @Column({nullable: false})
    otp: number

    @Field(()=> Date)
    @CreateDateColumn()
    created_on: Date


    // @Field(()=> User,)
    @OneToOne(()=>User, (user)=>user.id,{eager: true, onDelete: 'CASCADE', })
    @JoinColumn()
    user: User   
 
    @Field(()=>String) 
    @Column({nullable:false,unique: true})   
    userID: string
}  