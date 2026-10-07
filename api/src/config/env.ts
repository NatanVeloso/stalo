import { z } from 'zod';

/** `.env` com valor vazio chega como '' — tratamos como "não informado". */
const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === '' ? undefined : v), schema.optional());

const bool = z.enum(['true', 'false']).transform((v) => v === 'true');

/**
 * Variáveis de ambiente validadas na subida. Falha cedo, com mensagem clara,
 * em vez de quebrar na primeira requisição. Cada uma está comentada em
 * .env.example.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGINS: z.string().default(''),

  DATABASE_PATH: z.string().default('./data/stalo.sqlite'),
  MEDIA_DIR: z.string().default('./data/media'),
  MIGRATIONS_DIR: z.string().default('./drizzle'),

  INSTAGRAM_ACCESS_TOKEN: optional(z.string().min(20)),
  INSTAGRAM_GRAPH_URL: z.url().default('https://graph.instagram.com'),
  TOKEN_ENCRYPTION_KEY: optional(z.string().regex(/^[0-9a-f]{64}$/i, 'esperado 64 caracteres hex')),
  ADMIN_API_KEY: optional(z.string().min(32)),

  SYNC_CRON: z.string().default('0 * * * *'),
  SYNC_MAX_POSTS: z.coerce.number().int().min(1).max(500).default(60),
  SYNC_ON_BOOT: bool.default(true),
  /** baixar os vídeos (mp4) além da thumbnail; desligado, o vídeo toca só no Instagram */
  SYNC_DOWNLOAD_VIDEOS: bool.default(false),
  SYNC_VIDEO_MAX_MB: z.coerce.number().int().min(1).max(2000).default(100),
});

export type Env = z.infer<typeof envSchema>;

/** Usado pelo ConfigModule: lança se algo estiver fora do esperado. */
export function validateEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Variáveis de ambiente inválidas:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

/** Lista de origens do CORS; vazia desliga o CORS. */
export function corsOrigins(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
