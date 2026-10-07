import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../../config/env.js';
import { decrypt, encrypt } from '../../common/utils/crypto.js';
import { errorMessage, redact } from '../../common/utils/redact.js';
import { SettingsRepository } from '../../database/settings.repository.js';
import { InstagramApiError } from './instagram-api.error.js';
import type { IgRefreshResponse } from './instagram.types.js';

const SETTING_KEY = 'instagram.token';
/** renova quando faltar menos que isso para vencer (tokens de longa duração valem 60 dias) */
const REFRESH_AHEAD_MS = 10 * 24 * 60 * 60 * 1000;

interface StoredToken {
  token: string;
  /** ISO; ausente quando é o token do .env, cuja validade não conhecemos */
  expiresAt?: string;
}

/**
 * Guarda e renova o token de longa duração do Instagram.
 *
 * Ponto de partida é INSTAGRAM_ACCESS_TOKEN no ambiente. Depois da primeira
 * renovação o token novo fica no banco, cifrado com TOKEN_ENCRYPTION_KEY, e
 * passa a valer no lugar do ambiente. Sem a chave, o token renovado só vive em
 * memória (e o do .env precisa ser trocado à mão antes de vencer).
 */
@Injectable()
export class InstagramTokenService {
  private readonly logger = new Logger(InstagramTokenService.name);
  private memory?: StoredToken;

  constructor(
    private readonly config: ConfigService<Env, true>,
    private readonly settings: SettingsRepository,
  ) {}

  get isConfigured(): boolean {
    return Boolean(this.config.get('INSTAGRAM_ACCESS_TOKEN', { infer: true }) || this.load());
  }

  /** Token atual (o renovado, se houver; senão o do ambiente). */
  current(): string {
    const token = this.load()?.token ?? this.config.get('INSTAGRAM_ACCESS_TOKEN', { infer: true });
    if (!token) throw new Error('Instagram não configurado: defina INSTAGRAM_ACCESS_TOKEN');
    return token;
  }

  /** Renova se estiver perto de vencer (ou se nunca soubemos a validade). */
  async ensureFresh(refresh: (token: string) => Promise<IgRefreshResponse>): Promise<void> {
    const stored = this.load();
    const token = this.current();
    const expiresAt = stored?.expiresAt ? Date.parse(stored.expiresAt) : undefined;
    if (expiresAt && expiresAt - Date.now() > REFRESH_AHEAD_MS) return;

    try {
      const res = await refresh(token);
      this.save({
        token: res.access_token,
        expiresAt: new Date(Date.now() + res.expires_in * 1000).toISOString(),
      });
      this.logger.log(`Token do Instagram renovado; vence em ${Math.round(res.expires_in / 86400)} dias`);
    } catch (err) {
      // a Meta só renova tokens com mais de 24h: um token recém-gerado cai aqui e segue valendo
      if (err instanceof InstagramApiError && err.isAuthError) throw err;
      this.logger.warn(`Não foi possível renovar o token do Instagram: ${redact(errorMessage(err), [token])}`);
    }
  }

  /** Token rejeitado pela Meta: esquece o renovado para voltar ao do ambiente na próxima tentativa. */
  invalidateStored(): void {
    this.memory = undefined;
    this.settings.delete(SETTING_KEY);
  }

  private load(): StoredToken | undefined {
    if (this.memory) return this.memory;
    const key = this.config.get('TOKEN_ENCRYPTION_KEY', { infer: true });
    const raw = this.settings.get(SETTING_KEY);
    if (!raw || !key) return undefined;
    try {
      this.memory = JSON.parse(decrypt(raw, key)) as StoredToken;
      return this.memory;
    } catch {
      this.logger.warn('Token guardado no banco não pôde ser decifrado (TOKEN_ENCRYPTION_KEY mudou?); ignorando');
      return undefined;
    }
  }

  private save(next: StoredToken): void {
    this.memory = next;
    const key = this.config.get('TOKEN_ENCRYPTION_KEY', { infer: true });
    if (!key) {
      this.logger.warn('TOKEN_ENCRYPTION_KEY ausente: o token renovado fica só em memória até o próximo restart');
      return;
    }
    this.settings.set(SETTING_KEY, encrypt(JSON.stringify(next), key));
  }
}
