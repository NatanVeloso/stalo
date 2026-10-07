import { decrypt, encrypt } from './crypto.js';

const KEY = 'a'.repeat(64);

describe('crypto', () => {
  it('cifra e decifra', () => {
    const payload = encrypt('token-secreto', KEY);
    expect(payload).not.toContain('token-secreto');
    expect(decrypt(payload, KEY)).toBe('token-secreto');
  });

  it('cada cifragem usa um iv novo', () => {
    expect(encrypt('x', KEY)).not.toBe(encrypt('x', KEY));
  });

  it('recusa chave errada e payload adulterado', () => {
    const payload = encrypt('x', KEY);
    expect(() => decrypt(payload, 'b'.repeat(64))).toThrow();
    expect(() => decrypt(payload.slice(0, -4) + 'AAAA', KEY)).toThrow();
    expect(() => encrypt('x', 'curta')).toThrow();
  });
});
