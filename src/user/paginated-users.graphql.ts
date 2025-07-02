import { Field, ObjectType } from '@nestjs/graphql';
import { UserGraphQL } from './user.graphql';

@ObjectType()
export class PaginatedUsersGraphQL {
  @Field(() => [UserGraphQL])
  items: [UserGraphQL];

  @Field()
  page: number;

  @Field()
  limit: number;

  @Field()
  total: number;
}
