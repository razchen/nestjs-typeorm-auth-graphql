import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ItemGraphQL } from './item.graphql';
import { ItemService } from './item.service';
import { Request, UseGuards } from '@nestjs/common';
import { RequestWithUser } from 'src/types/Auth';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { UpdateTagsInput } from './dto/update-tags.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Query(() => [ItemGraphQL])
  async getAllItems() {
    return await this.itemService.findAll();
  }

  @Query(() => ItemGraphQL)
  async getItemById(@Args('id', { type: () => Int }) id: number) {
    return await this.itemService.findOne(id);
  }

  @Mutation(() => ItemGraphQL)
  async createItem(@Context() context, @Args('input') input: CreateItemInput) {
    const userId = context.req.user.id as number;
    return await this.itemService.create(userId, input);
  }

  @Mutation(() => ItemGraphQL)
  async updateItem(
    @Request() req: RequestWithUser,
    @Args('id') id: number,
    @Args('input') input: UpdateItemInput,
  ) {
    const userId = req.user.id;
    return await this.itemService.update(id, userId, input);
  }

  @Mutation(() => Boolean)
  async deleteItem(@Args('id') id: number) {
    return await this.itemService.remove(id);
  }

  @Mutation(() => ItemGraphQL)
  async updateItemTags(
    @Args('id') id: number,
    @Args('input') input: UpdateTagsInput,
  ) {
    return await this.itemService.updateTags(id, input);
  }
}
