import { parseCaption } from './caption.js';

describe('parseCaption', () => {
  it('usa a primeira linha como título e o resto como corpo', () => {
    const r = parseCaption('Planejamento tributário não é só para empresa grande.\n\nTodo negócio paga imposto.\n\n#contabilidade #stalo');
    expect(r.title).toBe('Planejamento tributário não é só para empresa grande');
    expect(r.body).toBe('Todo negócio paga imposto.');
    expect(r.excerpt).toBe('Todo negócio paga imposto.');
    expect(r.hashtags).toEqual(['#contabilidade', '#stalo']);
  });

  it('tira emojis e marcadores das pontas do título', () => {
    expect(parseCaption('🚀 Dados + estratégia. Clareza para crescer. 📈').title).toBe('Dados + estratégia. Clareza para crescer');
  });

  it('corta título e resumo longos em palavra, com reticências', () => {
    const long = 'palavra '.repeat(40).trim();
    const r = parseCaption(long);
    expect(r.title.length).toBeLessThanOrEqual(91);
    expect(r.title.endsWith('…')).toBe(true);
    expect(r.excerpt.endsWith('…')).toBe(true);
  });

  it('mantém hashtags no meio do texto, mas remove as linhas finais só de hashtags', () => {
    const r = parseCaption('Título\nTexto com #hashtag no meio.\n#a #b\n@stalo');
    expect(r.body).toBe('Texto com #hashtag no meio.');
    expect(r.excerpt).toBe('Texto com no meio.');
  });

  it('trata as linhas de pontos antes das hashtags como rodapé (legenda real da Stalo)', () => {
    const r = parseCaption(
      'Sua empresa cresceu. O jeito de administrar ela, não.\n\nE isso não aparece de uma vez. Aparece nos detalhes:\n\n1. Tudo ainda passa por você.\nAprovação, pagamento, cliente insatisfeito.\n\n.\n.\n#empreendedor #donodenegocio',
    );
    expect(r.title).toBe('Sua empresa cresceu. O jeito de administrar ela, não');
    expect(r.body).toBe('E isso não aparece de uma vez. Aparece nos detalhes:\n\n1. Tudo ainda passa por você.\nAprovação, pagamento, cliente insatisfeito.');
    expect(r.excerpt.startsWith('E isso não aparece de uma vez.')).toBe(true);
    expect(r.hashtags).toEqual(['#empreendedor', '#donodenegocio']);
  });

  it('lida com legenda vazia', () => {
    expect(parseCaption(undefined)).toEqual({ title: 'Publicação', excerpt: '', body: '', hashtags: [] });
  });
});
