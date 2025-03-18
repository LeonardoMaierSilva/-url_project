import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: any }>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token inválido ou ausente');
    }

    const token = authHeader.split(' ')[1];
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const payload = this.jwtService.verify(token) as Record<string, any>;
      if (typeof payload !== 'object' || !payload) {
        throw new UnauthorizedException('Falha na verificação do token');
      }
      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new UnauthorizedException(
          `Erro ao verificar token: ${error.message}`,
        );
      }
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
