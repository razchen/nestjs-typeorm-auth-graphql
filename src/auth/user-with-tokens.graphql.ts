import { Field, ObjectType } from '@nestjs/graphql';
import { UserRole } from 'src/types/Auth';

@ObjectType()
export class UserWithTokensGraphQL {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => [UserRole])
  roles: UserRole[];

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
