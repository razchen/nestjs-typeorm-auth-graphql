import { Injectable } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Tag } from './entities/tag.entity';
import { UpdateTagsInput } from './dto/update-tags.input';
import { Pagination } from 'src/types/Response';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(
    userId: number,
    createItemInput: CreateItemInput,
  ): Promise<Item> {
    const item = this.itemRepository.create({
      ...createItemInput,
      user: { id: userId },
    });
    const saved = await this.itemRepository.save(item);

    return await this.findOne(saved.id);
  }

  async findAll(
    page: number = 0,
    limit: number = 0,
  ): Promise<Pagination<Item[]>> {
    const [items, total] = await this.itemRepository.findAndCount({
      relations: ['user', 'tags'],
    });

    return {
      items,
      total,
      limit,
      page,
    };
  }

  async findOne(id: number): Promise<Item> {
    return await this.itemRepository.findOneOrFail({
      where: { id },
      relations: ['user', 'tags'],
    });
  }

  async update(
    id: number,
    userId: number,
    updateItemInput: UpdateItemInput,
  ): Promise<Item> {
    const item = await this.itemRepository.findOneOrFail({
      where: { id, user: { id: userId } },
    });
    item.title = updateItemInput.title;
    item.description = updateItemInput.description;
    item.user = { id: userId } as User;
    const updated = await this.itemRepository.save(item);

    return await this.findOne(updated.id);
  }

  async remove(id: number): Promise<boolean> {
    await this.itemRepository.findOneOrFail({ where: { id } });
    await this.itemRepository.delete({ id });

    return true;
  }

  async updateTags(itemId: number, input: UpdateTagsInput): Promise<Item> {
    const { tagNames } = input;
    const item = await this.itemRepository.findOneOrFail({
      where: { id: itemId },
      relations: ['tags'],
    });

    const tags: Tag[] = [];
    for (const tagName of tagNames) {
      let tag = await this.tagRepository.findOneBy({ content: tagName });

      if (!tag) {
        const savedTag = this.tagRepository.create({ content: tagName });
        tag = await this.tagRepository.save(savedTag);
      }

      tags.push(tag);
    }

    item.tags = tags;

    const updated = await this.itemRepository.save(item);

    return await this.findOne(updated.id);
  }
}
