import { registerEnumType } from '@nestjs/graphql';
import { Request } from 'express';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export type JwtPayload = {
  id: number;
  email: number;
  roles: UserRole[];
};

export type RequestWithUser = {
  user: JwtPayload;
} & Request;

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

registerEnumType(UserRole, {
  name: 'UserRole',
});
