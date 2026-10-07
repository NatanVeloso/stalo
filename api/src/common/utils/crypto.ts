import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/**
 * AES-256-GCM para guardar o token do Instagram no banco. Saída em base64:
 * iv (12 bytes) + tag (16 bytes) + texto cifrado. A chave vem do ambiente
 * (TOKEN_ENCRYPTION_KEY, 64 hex), nunca do banco.
 */
export function encrypt(plain: string, keyHex: string): string {
  const key = toKey(keyHex);
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64');
}

export function decrypt(payload: string, keyHex: string): string {
  const key = toKey(keyHex);
  const buf = Buffer.from(payload, 'base64');
  if (buf.length < 28) throw new Error('payload cifrado inválido');
  const decipher = createDecipheriv('aes-256-gcm', key, buf.subarray(0, 12));
  decipher.setAuthTag(buf.subarray(12, 28));
  return Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString('utf8');
}

function toKey(hex: string): Buffer {
  if (!/^[0-9a-f]{64}$/i.test(hex)) throw new Error('chave deve ter 64 caracteres hex (32 bytes)');
  return Buffer.from(hex, 'hex');
}
