import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@ObjectType("personal_access_tokens")
@Entity("personal_access_tokens") 

export class PersonalAccessToken{

    @Field(()=>Int)
    @PrimaryGeneratedColumn() 
    id: number;

    @Field(()=>String,{description:"Jwt Token",nullable: false})
    @Column({nullable: false})
    token: string  

    @Field(()=> Date)
    @CreateDateColumn()   
    created_on: Date   
 

    // @Field(()=>User)
    @ManyToOne(()=>User, user => user.peronsalAccessTokens,{eager: true, onDelete: 'CASCADE',nullable: false},)
    // @JoinColumn({ name: 'userId' })  
    user: User 
 
     
    @Field(()=>String)
    @Column({nullable:false})  
    userId: string
    
  
}  