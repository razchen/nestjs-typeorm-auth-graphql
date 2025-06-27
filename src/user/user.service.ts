import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const saved = await this.userRepository.save(user);

    return saved;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    let user = await this.userRepository.findOneOrFail({ where: { id } });
    user = { ...user, ...updateUserDto };
    const updated = await this.userRepository.save(user);

    return updated;
  }

  async remove(id: number): Promise<string> {
    await this.userRepository.findOneOrFail({ where: { id } });
    await this.userRepository.delete({ id });

    return 'User deleted';
  }
}
