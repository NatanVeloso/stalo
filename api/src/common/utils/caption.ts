/**
 * Legenda do Instagram → título, resumo e corpo. A legenda não tem estrutura,
 * então a convenção é: a primeira linha é o título; o resto é o texto; linhas
 * só de hashtags no fim são rodapé e saem do corpo.
 */
export interface ParsedCaption {
  title: string;
  excerpt: string;
  /** Corpo sem o título e sem as linhas de hashtags do fim. */
  body: string;
  hashtags: string[];
}

const TITLE_MAX = 90;
const EXCERPT_MAX = 160;
const HASHTAG = /#[\p{L}\p{N}_]+/gu;

export function parseCaption(raw: string | undefined | null): ParsedCaption {
  const text = (raw ?? '').replace(/\r\n?/g, '\n').trim();
  if (!text) return { title: 'Publicação', excerpt: '', body: '', hashtags: [] };

  const lines = text.split('\n').map((l) => l.trim());
  const hashtags = [...new Set(text.match(HASHTAG) ?? [])];

  // rodapé: linhas finais que só têm hashtags, menções ou pontuação
  let end = lines.length;
  while (end > 1 && isFooterLine(lines[end - 1])) end--;
  const content = lines.slice(0, end);

  const firstIdx = Math.max(
    0,
    content.findIndex((l) => l.length > 0),
  );
  const firstLine = content[firstIdx] ?? lines[0];
  const title = truncate(cleanTitle(firstLine), TITLE_MAX) || 'Publicação';

  const body = content
    .slice(firstIdx + 1)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const excerptSource = (body || firstLine).replace(HASHTAG, '').replace(/\s+/g, ' ').trim();
  const excerpt = truncate(excerptSource, EXCERPT_MAX);

  return { title, excerpt, body, hashtags };
}

function isFooterLine(line: string): boolean {
  if (!line) return true;
  // linhas só de pontos/traços são o "espaçador" que se usa antes das hashtags
  if (/^[\s.\-–—·•_]*$/.test(line)) return true;
  return /^(?:[#@][\p{L}\p{N}_.]+[\s.,;|·•-]*)+$/u.test(line);
}

/** Tira marcadores e emojis das pontas; o título vira o <h1>/<h2> do site. */
function cleanTitle(line: string): string {
  return line
    .replace(/^[\s\p{Extended_Pictographic}\p{Emoji_Presentation}️‍•·\-–—*>|]+/u, '')
    .replace(/[\s\p{Extended_Pictographic}\p{Emoji_Presentation}️‍•·|]+$/u, '')
    .replace(/[.:;]+$/, '')
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return `${(space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,;:]+$/, '')}…`;
}
