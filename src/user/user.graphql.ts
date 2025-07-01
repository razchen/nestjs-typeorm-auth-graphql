import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/types/Auth';

@ObjectType()
export class UserGraphQL {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => [UserRole])
  roles: UserRole[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
