import { Field, ObjectType } from '@nestjs/graphql';
import { ItemGraphQL } from './item.graphql';

@ObjectType()
export class PaginatedItemsGraphQL {
  @Field(() => [ItemGraphQL])
  items: [ItemGraphQL];

  @Field()
  page: number;

  @Field()
  limit: number;

  @Field()
  total: number;
}
