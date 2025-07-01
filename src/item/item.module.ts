import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Tag } from './entities/tag.entity';
import { ItemResolver } from './item.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Tag])],
  providers: [ItemService, ItemResolver],
})
export class ItemModule {}
