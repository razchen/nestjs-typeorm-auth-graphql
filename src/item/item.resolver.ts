import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ItemGraphQL } from './item.graphql';
import { ItemService } from './item.service';
import { UseGuards } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { UpdateTagsInput } from './dto/update-tags.input';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginatedItemsGraphQL } from './paginated-items.graphql';

@UseGuards(JwtAuthGuard)
@Resolver()
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Query(() => PaginatedItemsGraphQL)
  async getAllItems(@Args('page', { type: () => Int }) page: number) {
    const LIMIT = 30;
    return await this.itemService.findAll(page, LIMIT);
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
    @Context() context,
    @Args('id') id: number,
    @Args('input') input: UpdateItemInput,
  ) {
    const userId = context.req.user.id as number;
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
