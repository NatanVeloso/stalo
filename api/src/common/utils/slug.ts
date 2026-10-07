/** "Gestão Contábil & RH" → "gestao-contabil-rh" (máx. 60 caracteres, cortado em palavra). */
export function slugify(text: string, max = 60): string {
  const base = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (base.length <= max) return base;
  const cut = base.slice(0, max);
  const lastDash = cut.lastIndexOf('-');
  return (lastDash > max / 2 ? cut.slice(0, lastDash) : cut).replace(/-+$/, '');
}

/**
 * Slug da publicação: título + final do id do Instagram, para ficar legível na
 * URL e único mesmo com dois posts de título igual.
 */
export function postSlug(title: string, mediaId: string): string {
  const suffix = mediaId.slice(-6);
  const base = slugify(title) || 'publicacao';
  return `${base}-${suffix}`;
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
