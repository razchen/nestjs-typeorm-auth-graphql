import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/types/Auth';
import { Pagination } from 'src/types/Response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(input: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = this.userRepository.create({
      ...input,
      roles: [UserRole.USER],
      password: hashedPassword,
    });

    const saved = await this.userRepository.save(user);

    return saved;
  }

  async findAll(
    page: number = 1,
    limit: number = 30,
  ): Promise<Pagination<User[]>> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: users,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
    });
    return user;
  }

  async update(id: number, input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      where: { id },
    });
    if (input.name) {
      user.name = input.name;
    }

    if (input.email) {
      user.email = input.email;
    }

    if (input.password) {
      user.password = await bcrypt.hash(input.password, 10);
    }

    const updated = await this.userRepository.save(user);

    return updated;
  }

  async remove(id: number): Promise<boolean> {
    await this.userRepository.findOneOrFail({ where: { id } });
    await this.userRepository.delete({ id });

    return true;
  }
}
