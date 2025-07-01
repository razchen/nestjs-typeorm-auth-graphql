import { Field, ObjectType } from '@nestjs/graphql';
import { ItemGraphQL } from './item.graphql';

@ObjectType()
export class TagGraphQL {
  @Field()
  id: number;

  @Field()
  content: string;

  @Field(() => [ItemGraphQL])
  items: ItemGraphQL[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
