import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtPayload, RequestWithUser } from 'src/types/Auth';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const authHeader = req.headers['authorization'] as string;

    if (!authHeader.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = authHeader.replace('Bearer ', '');
    const secret: string = this.configService.getOrThrow('JWT_SECRET');
    const decoded = jwt.verify(token, secret);

    req.user = decoded as JwtPayload;

    return true;
  }
}
