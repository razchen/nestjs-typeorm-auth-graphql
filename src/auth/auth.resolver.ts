import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { TokensGraphQL } from './auth.graphql';
import { UserGraphQL } from '../user/user.graphql';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshInput } from './dto/refresh.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserGraphQL)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => TokensGraphQL)
  async login(@Args('input') input: LoginInput) {
    const user = await this.authService.validate(input.email, input.password);

    if (!user) throw new UnauthorizedException('Invalid Credentials');

    return await this.authService.login(user);
  }

  @Mutation(() => TokensGraphQL)
  async refresh(@Args('input') input: RefreshInput) {
    return this.authService.refresh(input.refreshToken);
  }
}
