import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserGraphQL } from './user.graphql';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => UserGraphQL)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserGraphQL])
  async getAllUsers() {
    return this.userService.findAll();
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
