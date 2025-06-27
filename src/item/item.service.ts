import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Tag } from './entities/tag.entity';
import { UpdateTagsDto } from './dto/update-tags.dto';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item) private readonly itemRepository: Repository<Item>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(userId: number, createItemDto: CreateItemDto): Promise<Item> {
    const item = this.itemRepository.create({
      ...createItemDto,
      user: { id: userId },
    });
    const saved = await this.itemRepository.save(item);

    return saved;
  }

  async findAll(): Promise<Item[]> {
    return await this.itemRepository.find({ relations: ['user', 'tags'] });
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
    updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    const item = await this.itemRepository.findOneOrFail({ where: { id } });
    item.title = updateItemDto.title;
    item.description = updateItemDto.description;
    item.user = { id: userId } as User;
    const updated = await this.itemRepository.save(item);

    return updated;
  }

  async remove(id: number): Promise<string> {
    await this.itemRepository.findOneOrFail({ where: { id } });
    await this.itemRepository.delete({ id });

    return 'Item deleted';
  }

  async updateTags(itemId: number, dto: UpdateTagsDto): Promise<string> {
    const { tagNames } = dto;
    const item = await this.itemRepository.findOneOrFail({
      where: { id: itemId },
      relations: ['tags'],
    });

    const tags: Tag[] = [];
    for (const tagName of tagNames) {
      let tag = await this.tagRepository.findOneBy({ content: tagName });

      console.log('exists', tag);

      if (!tag) {
        const savedTag = this.tagRepository.create({ content: tagName });
        tag = await this.tagRepository.save(savedTag);
      }

      tags.push(tag);
    }

    item.tags = tags;

    await this.itemRepository.save(item);

    return 'Tags added';
  }
}
