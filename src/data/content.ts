export const nav = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Como funciona', href: '#processo' },
  { label: 'Contato', href: '#contato' },
]

export const contact = {
  email: 'contato@staloconsulting.com.br',
  phone: '(62) 9 9513-6343',
  phoneHref: 'tel:+5562995136343',
  whatsapp:
    'https://wa.me/5562995136343?text=' +
    encodeURIComponent('Olá! Vim pelo site da Stalo e quero falar com um consultor.'),
}

export const services = [
  {
    n: '01',
    title: 'Gestão Contábil',
    text: 'Uma gestão contábil integrada, precisa e orientada por dados. Entregamos relatórios estratégicos, organização total e visão clara para decisões seguras e crescimento contínuo.',
  },
  {
    n: '02',
    title: 'Gestão de Departamento Pessoal & RH',
    text: 'Executamos toda a rotina trabalhista com rigor técnico e eficiência. Reduzimos riscos, estruturamos processos e garantimos uma experiência fluida e confiável para sua equipe.',
  },
  {
    n: '03',
    title: 'Inteligência Tributária',
    text: 'Estruturamos estratégias fiscais com alto nível de precisão. Identificamos oportunidades, mitigamos os riscos e otimizamos a carga tributária com segurança jurídica e visão consultiva.',
  },
  {
    n: '04',
    title: 'BPO Financeiro',
    text: 'Assumimos sua operação financeira com controle absoluto, padronização e transparência. Você ganha previsibilidade, precisão nos números e tempo para focar no estratégico.',
  },
  {
    n: '05',
    title: 'Revisão e Recuperação de Tributos',
    text: 'Analisamos profundamente seu histórico fiscal para encontrar créditos, corrigir inconsistências e recuperar valores pagos indevidamente — fortalecendo sua saúde financeira.',
  },
  {
    n: '06',
    title: 'Inteligência de Sucesso',
    text: 'Acompanhamos de perto os indicadores do seu negócio para antecipar cenários, orientar decisões e impulsionar performance. Estratégia contínua para crescimento sustentável e resultados consistentes.',
  },
]

export const servicesCta = { label: 'Fale com um consultor', href: contact.whatsapp }

export const marquee = [
  'Gestão Contábil',
  'Departamento Pessoal & RH',
  'Inteligência Tributária',
  'BPO Financeiro',
  'Recuperação de Tributos',
  'Inteligência de Sucesso',
]

export const stats = [
  { value: 95, suffix: '%', label: 'Índice de satisfação dos clientes' },
  { value: 1, suffix: 'BI', label: 'Em ativos acompanhados' },
  { prefix: '+', value: 300, label: 'Empresas atendidas', sub: 'Que confiam na nossa inteligência contábil' },
]

export const values = [
  { title: 'Atendimento direto', text: 'Um responsável dedicado à sua conta.' },
  { title: 'Processos digitais', text: 'Documentos e relatórios online.' },
  { title: 'Prazo em dia', text: 'Obrigações entregues sem atraso.' },
]

export type StepTone = 'dark' | 'light'

export const steps: {
  n: string
  name: string
  eyebrow: string
  title: string
  accent: string
  text: string
  image: string
  tone: StepTone
  bg: string
}[] = [
  {
    n: '01',
    name: 'Como ser um cliente da Stalo',
    eyebrow: 'Análise',
    title: 'O primeiro passo para uma gestão contábil',
    accent: 'inteligente e transformadora',
    text: 'Realizamos um diagnóstico completo da sua estrutura atual para identificar riscos, oportunidades e o melhor caminho estratégico para o seu crescimento.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80',
    tone: 'dark',
    bg: 'bg-navy',
  },
  {
    n: '02',
    name: 'Plano personalizado',
    eyebrow: 'Estratégia',
    title: 'Estratégia financeira',
    accent: 'desenhada para o seu negócio',
    text: 'Construímos um plano personalizado, combinando dados, tecnologia e visão consultiva para direcionar sua empresa ao próximo nível.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
    tone: 'light',
    bg: 'bg-paper',
  },
  {
    n: '03',
    name: 'Acompanhamento contínuo',
    eyebrow: 'Suporte',
    title: 'Evolução guiada e',
    accent: 'constância na performance',
    text: 'Mantemos um acompanhamento próximo, analisando resultados, ajustando rotas e garantindo a execução precisa da estratégia para que seu negócio continue avançando com segurança e inteligência.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
    tone: 'dark',
    bg: 'bg-teal-deep',
  },
]

export type ResultItem =
  | { kind: 'logo'; name: string; src: string; /** colunas no grid de 4 (desktop) */ span?: 1 | 2 }
  | {
      kind: 'quote'
      text: string
      author: string
      company: string
      avatar: string
      span?: 1 | 2
    }

/** Seção "Resultados": bento com logos de clientes e depoimentos (grid de 4 colunas no desktop). */
export const results = {
  title: 'Resultados que transformam',
  accent: 'negócios.',
  lead: 'O que nossos clientes dizem.',
  background: '/clientes/escritorio.webp',
  items: [
    { kind: 'logo', name: 'Supriloc', src: '/clientes/supriloc-branca.avif' },
    { kind: 'logo', name: 'Lissen Fit Wear', src: '/clientes/lissen.avif' },
    {
      kind: 'quote',
      span: 2,
      text: 'Com a Stalo descobrimos clareza, organização e previsibilidade. Hoje tomamos decisões com segurança e enxergamos nosso negócio de forma estratégica.',
      author: 'Emanoel Oliveira',
      company: 'Gene Digital',
      avatar: '/clientes/emanoel-oliveira.avif',
    },
    {
      kind: 'quote',
      span: 2,
      text: 'A Stalo trouxe inteligência, orientação e direção para nossa gestão. O que antes era confuso, agora é simples, estruturado e escalável.',
      author: 'Walex Mateus',
      company: 'Jarbas.ai',
      avatar: '/clientes/walex-mateus.avif',
    },
    { kind: 'logo', name: 'Tshirteria', src: '/clientes/tshirteria.avif' },
    { kind: 'logo', name: 'Sky Consórcios', src: '/clientes/sky.avif' },
  ] satisfies ResultItem[],
}

export const footerLinks = [
  { label: 'Soluções', href: '#servicos' },
  { label: 'Portal do Cliente', href: '#' },
  { label: 'Como Funciona', href: '#processo' },
  { label: 'Contato', href: '#contato' },
  { label: 'FAQ', href: '#' },
]

export const images = {
  hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80',
  about: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80',
  contact: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80',
}
