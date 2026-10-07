import { redact } from './redact.js';

describe('redact', () => {
  it('esconde o access_token em URLs e os segredos informados', () => {
    const msg = 'GET https://graph.instagram.com/me/media?fields=id&access_token=IGQVJ123abc falhou: IGQVJ123abc inválido';
    expect(redact(msg, ['IGQVJ123abc'])).toBe(
      'GET https://graph.instagram.com/me/media?fields=id&access_token=*** falhou: *** inválido',
    );
  });

  it('não mexe em segredos curtos demais (evitaria apagar palavras comuns)', () => {
    expect(redact('erro abc', ['abc'])).toBe('erro abc');
  });
});
