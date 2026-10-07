import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import type { Env } from '../../config/env.js';

/**
 * Protege endpoints administrativos com o header `x-api-key`. Sem
 * ADMIN_API_KEY no ambiente o endpoint fica desativado (403). A comparação
 * passa por hash para ser em tempo constante mesmo com tamanhos diferentes.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService<Env, true>) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.config.get('ADMIN_API_KEY', { infer: true });
    if (!expected) throw new ForbiddenException('Endpoint administrativo desativado');

    const req = context.switchToHttp().getRequest<Request>();
    const given = req.header('x-api-key');
    if (!given || !safeEqual(given, expected)) throw new UnauthorizedException();
    return true;
  }
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}
