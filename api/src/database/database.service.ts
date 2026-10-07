import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { Env } from '../config/env.js';
import * as schema from './schema.js';

export type Db = BetterSQLite3Database<typeof schema>;

/**
 * Abre o SQLite, aplica as migrações pendentes (pasta drizzle/) e expõe o
 * Drizzle. Uma conexão só, WAL ligado: leituras do site não esperam a sync.
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseService.name);
  private sqlite!: Database.Database;
  private _db!: Db;

  constructor(private readonly config: ConfigService<Env, true>) {}

  get db(): Db {
    return this._db;
  }

  onModuleInit() {
    const file = resolve(this.config.get('DATABASE_PATH', { infer: true }));
    mkdirSync(dirname(file), { recursive: true });

    this.sqlite = new Database(file);
    this.sqlite.pragma('journal_mode = WAL');
    this.sqlite.pragma('foreign_keys = ON');
    this.sqlite.pragma('busy_timeout = 5000');
    this._db = drizzle(this.sqlite, { schema });

    migrate(this._db, { migrationsFolder: resolve(this.config.get('MIGRATIONS_DIR', { infer: true })) });
    this.logger.log(`Banco pronto em ${file}`);
  }

  onApplicationShutdown() {
    this.sqlite?.close();
  }
}
