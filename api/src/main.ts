import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { corsOrigins, type Env } from './config/env.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: ['log', 'warn', 'error'] });
  const config = app.get(ConfigService<Env, true>);

  app.set('trust proxy', 1); // atrás do nginx: o throttler precisa do IP real
  app.disable('x-powered-by');
  // as imagens de /media são carregadas pelo site; em dev ele roda em outra origem
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const origins = corsOrigins(config.get('CORS_ORIGINS', { infer: true }));
  if (origins.length) app.enableCors({ origin: origins, methods: ['GET', 'POST'], maxAge: 600 });

  app.enableShutdownHooks();
  const port = config.get('PORT', { infer: true });
  await app.listen(port);
  new Logger('Bootstrap').log(`API no ar em http://localhost:${port}/api`);
}

await bootstrap();
