import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("orders")
@ObjectType("orders")
export class Order{

    @Field(()=>Int)
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column({type:"date",nullable:false})
    orderDate: Date

    @Field()
    @Column({type:"decimal",nullable:false,default:0})
    totalAmount:number

    @Field()
    @Column({nullable:false})
    status : string

    @ManyToOne(()=>User,(user)=>user.orders)
    user:User

    @OneToMany(()=>OrderItem,(orderItem)=>orderItem.order) 
    orderItems:OrderItem[]

}


@Entity("orderItems")
@ObjectType("orderItems")
export class OrderItem{

    @Field(()=>Int)
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column({nullable:false})
    quantity: number

    @Field()
    @Column({type:"decimal",nullable:false,default:0})
    subTotal:number

    @ManyToOne(()=>Order,(order)=>order.orderItems)
    order:Order

    @ManyToOne(()=>Product,(product)=>product.orderItems)
    product : Product

}