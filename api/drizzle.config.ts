import { defineConfig } from 'drizzle-kit';

// Só para o drizzle-kit (gerar migrações). Em runtime o DatabaseService lê o
// mesmo caminho pelo ConfigService.
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/database/schema.ts',
  out: './drizzle',
  dbCredentials: { url: process.env.DATABASE_PATH ?? './data/stalo.sqlite' },
});
