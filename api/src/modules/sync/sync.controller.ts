import { ConflictException, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiKeyGuard } from '../../common/guards/api-key.guard.js';
import { SyncService, type SyncReport } from './sync.service.js';

/** Dispara a sincronização fora do horário do cron (ex.: logo depois de publicar). */
@Controller('sync')
@UseGuards(ApiKeyGuard)
export class SyncController {
  constructor(private readonly sync: SyncService) {}

  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async run(): Promise<SyncReport> {
    const report = await this.sync.run();
    if (report.status === 'already-running') throw new ConflictException('Sincronização já em andamento');
    return report;
  }
}
