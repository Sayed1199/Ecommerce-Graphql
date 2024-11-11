// paginated-response.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaginatedResponse<T> {
  @Field(() => [Object], { description: "paginated items" })
  items: T[];

  @Field(() => Int, { description: "Total items count" })
  totalItems: number;

  @Field(() => Int, { description: "Current page number" })
  currentPage: number;

  @Field(() => Int, { description: "Total number of pages" })
  totalPages: number;
}