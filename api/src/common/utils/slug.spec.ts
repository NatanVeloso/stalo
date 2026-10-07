import { SLUG_PATTERN, postSlug, slugify } from './slug.js';

describe('slugify', () => {
  it('remove acentos e símbolos', () => {
    expect(slugify('Gestão Contábil & RH!')).toBe('gestao-contabil-rh');
  });

  it('corta em palavra no limite', () => {
    const s = slugify('uma frase bem comprida para testar o corte do slug no limite certo', 30);
    expect(s.length).toBeLessThanOrEqual(30);
    expect(s.endsWith('-')).toBe(false);
  });
});

describe('postSlug', () => {
  it('junta título e fim do id, no formato aceito pela API', () => {
    const s = postSlug('Clareza para crescer', '17895695668004550');
    expect(s).toBe('clareza-para-crescer-004550');
    expect(SLUG_PATTERN.test(s)).toBe(true);
  });

  it('tem fallback para título vazio', () => {
    expect(postSlug('🚀', '123456789')).toBe('publicacao-456789');
  });
});
