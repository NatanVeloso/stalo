/**
 * Remove segredos de mensagens antes de logar. A API da Meta devolve a URL
 * chamada em alguns erros, e a URL carrega o access_token.
 */
export function redact(message: string, secrets: Array<string | undefined> = []): string {
  let out = message.replace(/access_token=[^&\s"']+/gi, 'access_token=***');
  for (const s of secrets) {
    if (s && s.length >= 8) out = out.split(s).join('***');
  }
  return out;
}

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
