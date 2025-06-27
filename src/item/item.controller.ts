import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/types/Auth';
import { UpdateTagsDto } from './dto/update-tags.dto';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(
    @Request() req: RequestWithUser,
    @Body() createItemDto: CreateItemDto,
  ) {
    const userId = req.user.id;
    return this.itemService.create(+userId, createItemDto);
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    const userId = req.user.id;
    return this.itemService.update(+userId, +id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }

  @Patch(':id/tags/update')
  updateTags(@Param('id') id: string, @Body() updateTagsDto: UpdateTagsDto) {
    return this.itemService.updateTags(+id, updateTagsDto);
  }
}
