import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TokensGraphQL {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
