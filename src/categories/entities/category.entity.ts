import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType("categories")
@Entity("categories")
export class Category{

    @Field(()=>Int)
    @PrimaryGeneratedColumn() 
    id: number

    @Field()
    @Column({nullable:false,unique:true})
    name: string

    @Field({nullable:true})
    @Column({nullable:true})
    description?: string

    @Field()
    @CreateDateColumn()
    createdAt: Date

    @Field()
    @UpdateDateColumn()
    updatedAt: Date

    @Field({nullable: true})
    @DeleteDateColumn()
    deletedAt?: Date

    @OneToMany(()=>Product,(product)=>product.category)
    products: Product[]


}