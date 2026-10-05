/**
 * Número de destaque do "Sobre". O valor também é por idioma, porque a escala
 * muda na tradução (1 BI em português, 1 B em inglês, 1000 M em espanhol).
 */
export type Stat = { value: number; prefix?: string; suffix?: string; label: string; sub?: string }

/** Parágrafo (string) ou lista de itens (string[]). */
export type LegalBlock = string | string[]
export type LegalSection = { title: string; body: LegalBlock[] }
export type LegalDoc = {
  /** Trecho da URL depois do prefixo do idioma (ex.: `privacy` em /en/privacy). */
  slug: string
  title: string
  updated: string
  intro: string
  /** Só nas traduções: avisa que, em caso de divergência, vale o texto em português. */
  notice?: string
  sections: LegalSection[]
}

export type LegalKey = 'privacy' | 'terms'
export type LegalDocs = Record<LegalKey, LegalDoc>
