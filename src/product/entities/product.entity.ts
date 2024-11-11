import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Category } from "src/categories/entities/category.entity";
import { OrderItem } from "src/orders/entities/order.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("products")
@ObjectType("products")
export class Product{

    @Field(()=>Int)
    @PrimaryGeneratedColumn()
    id: number

    @Field()
    @Column({nullable:false,unique:true})
    name: string

    @Field(()=>Number) 
    @Column({type:"decimal",nullable:false,default:0})
    price:number
 
    @Field()
    @Column({nullable:false})
    description : string

    @Field(()=>Number)
    @Column({nullable:false,default:0})
    stockQuantity:number

    @OneToMany(()=>OrderItem,(orderItem)=>orderItem.product) 
    orderItems:OrderItem[]

    @Field(()=>Category,{nullable:true})
    @ManyToOne(()=>Category,(category)=>category.products) 
    category?: Category

    @Field()
    @CreateDateColumn()
    createdAt: Date

    @Field()
    @UpdateDateColumn()
    updatedAt: Date

    @Field({nullable: true})
    @DeleteDateColumn()
    deletedAt?: Date

} 