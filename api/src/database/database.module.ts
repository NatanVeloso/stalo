import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service.js';
import { SettingsRepository } from './settings.repository.js';

@Global()
@Module({
  providers: [DatabaseService, SettingsRepository],
  exports: [DatabaseService, SettingsRepository],
})
export class DatabaseModule {}
