import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserGraphQL } from './user.graphql';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginatedUsersGraphQL } from './paginated-users.graphql';

@UseGuards(JwtAuthGuard)
@Resolver(() => UserGraphQL)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => PaginatedUsersGraphQL)
  async getAllUsers(@Args('page', { type: () => Int }) page: number) {
    const LIMIT = 30;
    return this.userService.findAll(page, LIMIT);
  }

  @Query(() => UserGraphQL)
  async getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => UserGraphQL)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }

  @Mutation(() => UserGraphQL)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.userService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    await this.userService.remove(id);
    return true;
  }
}
