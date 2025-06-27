import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tokens, UserRole } from 'src/types/Auth';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RefreshDto } from './dto/refresh.dto';

type UserWithTokens = Tokens & {
  id: number;
  email: string;
  name: string;
  roles: UserRole[];
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  generateTokens(
    id: number,
    email: string,
    roles: UserRole[],
  ): { accessToken: string; refreshToken: string } {
    const payload = { id, email, roles };
    const secret: string = this.configService.getOrThrow('JWT_SECRET');
    const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, secret, { expiresIn: '30d' });

    return { accessToken, refreshToken };
  }

  async updateHashedRefreshToken(
    id: number,
    refreshToken: string,
  ): Promise<string> {
    const user = await this.userRepository.findOneOrFail({ where: { id } });
    user.hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.save(user);

    return user.hashedRefreshToken;
  }

  async register(dto: RegisterDto): Promise<UserWithTokens> {
    const user = this.userRepository.create({ ...dto, roles: [UserRole.USER] });
    const created = await this.userRepository.save(user);
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
      [UserRole.USER],
    );
    await this.updateHashedRefreshToken(user.id, refreshToken);

    return {
      id: created.id,
      name: created.name,
      email: created.email,
      roles: created.roles,
      accessToken,
      refreshToken,
    };
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOneOrFail();

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new UnauthorizedException('Invalid Credentials');

    return user;
  }

  async login(user: User): Promise<UserWithTokens> {
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
      [UserRole.USER],
    );
    await this.updateHashedRefreshToken(user.id, refreshToken);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      accessToken,
      refreshToken,
    };
  }

  async refresh(userId: number, dto: RefreshDto): Promise<Tokens> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });

    const valid = await bcrypt.compare(
      dto.refreshToken,
      user.hashedRefreshToken,
    );
    if (!valid) throw new UnauthorizedException('Token expired');

    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
      user.roles,
    );

    await this.updateHashedRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}
