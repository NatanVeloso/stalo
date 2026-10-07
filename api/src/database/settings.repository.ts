import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from './database.service.js';
import { settings } from './schema.js';

/** Pares chave/valor da aplicação (tabela `settings`). */
@Injectable()
export class SettingsRepository {
  constructor(private readonly database: DatabaseService) {}

  get(key: string): string | undefined {
    return this.database.db
      .select({ value: settings.value })
      .from(settings)
      .where(eq(settings.key, key))
      .get()?.value;
  }

  set(key: string, value: string): void {
    const updatedAt = new Date().toISOString();
    this.database.db
      .insert(settings)
      .values({ key, value, updatedAt })
      .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt } })
      .run();
  }

  delete(key: string): void {
    this.database.db.delete(settings).where(eq(settings.key, key)).run();
  }
}
