import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/types/Auth';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const authHeader = req.headers['authorization'] as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('throwing unauthorized');
      throw new UnauthorizedException();
    }

    const token = authHeader.replace('Bearer ', '');
    const secret: string = this.configService.getOrThrow('JWT_SECRET');

    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded as JwtPayload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
