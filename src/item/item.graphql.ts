import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Tag } from './entities/tag.entity';
import { UserGraphQL } from 'src/user/user.graphql';
import { TagGraphQL } from './tag.graphql';

@ObjectType()
export class ItemGraphQL {
  @Field()
  id: number;

  @Field(() => UserGraphQL)
  user: UserGraphQL;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [TagGraphQL])
  tags: Tag[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
