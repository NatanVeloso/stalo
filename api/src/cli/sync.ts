import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { SyncService } from '../modules/sync/sync.service.js';

/**
 * `npm run sync`: roda uma sincronização e sai. Serve para um cron do sistema
 * ou para testar o token sem subir a API.
 */
const app = await NestFactory.createApplicationContext(AppModule, { logger: ['log', 'warn', 'error'] });
try {
  const report = await app.get(SyncService).run();
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = report.status === 'ok' ? 0 : 1;
} finally {
  await app.close();
}
