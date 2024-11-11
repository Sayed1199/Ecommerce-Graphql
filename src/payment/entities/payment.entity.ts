import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@ObjectType("payments")
@Entity("payments")
export class Payment{

    @Field(()=>Int)
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column()
    amount: number;

    @Field()
    @Column()
    paymentDate: Date;

    @Field()
    @Column()
    status: string;

    @ManyToOne(()=>User,(user)=>user.payments)
    user:User


}