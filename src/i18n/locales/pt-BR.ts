import type { Stat } from '../types'

/**
 * Textos do site em português (idioma padrão e fonte da verdade).
 * O tipo `Dictionary` sai deste arquivo: chave nova entra aqui primeiro e o
 * TypeScript passa a exigir a mesma chave em en.ts e es.ts.
 */

const stats: Stat[] = [
  { value: 95, suffix: '%', label: 'Índice de satisfação dos clientes' },
  { value: 1, suffix: 'BI', label: 'Em ativos acompanhados' },
  { prefix: '+', value: 300, label: 'Empresas atendidas', sub: 'Que confiam na nossa inteligência contábil' },
]

export const ptBR = {
  meta: {
    title: 'Stalo Consulting — Contabilidade clara para empresas que querem crescer',
    description:
      'Stalo Consulting — contabilidade clara para empresas que querem crescer. Contabilidade, fiscal, departamento pessoal, abertura de empresas, BPO financeiro e consultoria.',
  },

  common: {
    home: 'Início',
    talkToAccountant: 'Fale com um contador',
    talkToConsultant: 'Fale com um consultor',
    whatsappLabel: 'Falar no WhatsApp',
    /** Mensagem que já vem preenchida quando o visitante abre o WhatsApp. */
    whatsappMessage: 'Olá! Vim pelo site da Stalo e quero falar com um consultor.',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    language: 'Idioma',
    rights: 'Todos os direitos reservados.',
  },

  nav: {
    services: 'Serviços',
    about: 'Sobre',
    process: 'Como funciona',
    faq: 'FAQ',
    contact: 'Contato',
  },

  hero: {
    title: 'Contabilidade clara para empresas que',
    accent: 'querem crescer.',
    text: 'Cuidamos da contabilidade, dos impostos e da folha da sua empresa, com atendimento próximo e relatórios que você entende.',
    primaryCta: 'Solicitar proposta',
    secondaryCta: 'Ver serviços',
  },

  /** Carrossel de logos na base da hero (ClientLogos.tsx). */
  clients: {
    label: 'Empresas que confiam na Stalo',
  },

  services: {
    title: 'Tudo o que sua empresa precisa,',
    accent: 'num só lugar.',
    lead: 'Do registro do CNPJ ao fechamento do balanço, com uma equipe dedicada ao seu negócio.',
    /** Convite único depois dos cards (o botão usa `common.talkToConsultant`). */
    cta: {
      title: 'Não sabe por onde começar?',
      text: 'Um consultor indica o serviço certo para o momento da sua empresa.',
    },
    marquee: [
      'Gestão Contábil',
      'Departamento Pessoal & RH',
      'Inteligência Tributária',
      'BPO Financeiro',
      'Recuperação de Tributos',
      'Inteligência de Sucesso',
    ],
    items: {
      accounting: {
        title: 'Gestão Contábil',
        text: 'Uma gestão contábil integrada, precisa e orientada por dados. Entregamos relatórios estratégicos, organização total e visão clara para decisões seguras e crescimento contínuo.',
      },
      hr: {
        title: 'Gestão de Departamento Pessoal & RH',
        text: 'Executamos toda a rotina trabalhista com rigor técnico e eficiência. Reduzimos riscos, estruturamos processos e garantimos uma experiência fluida e confiável para sua equipe.',
      },
      tax: {
        title: 'Inteligência Tributária',
        text: 'Estruturamos estratégias fiscais com alto nível de precisão. Identificamos oportunidades, mitigamos os riscos e otimizamos a carga tributária com segurança jurídica e visão consultiva.',
      },
      bpo: {
        title: 'BPO Financeiro',
        text: 'Assumimos sua operação financeira com controle absoluto, padronização e transparência. Você ganha previsibilidade, precisão nos números e tempo para focar no estratégico.',
      },
      recovery: {
        title: 'Revisão e Recuperação de Tributos',
        text: 'Analisamos profundamente seu histórico fiscal para encontrar créditos, corrigir inconsistências e recuperar valores pagos indevidamente — fortalecendo sua saúde financeira.',
      },
      success: {
        title: 'Inteligência de Sucesso',
        text: 'Acompanhamos de perto os indicadores do seu negócio para antecipar cenários, orientar decisões e impulsionar performance. Estratégia contínua para crescimento sustentável e resultados consistentes.',
      },
    },
  },

  about: {
    eyebrow: 'Sobre a Stalo',
    title: 'Um contador que conhece o seu negócio',
    accent: 'pelo nome.',
    lead: 'Trabalhamos lado a lado com empresários, transformando obrigações fiscais em informação útil para decidir. Cada cliente tem um responsável direto, sem filas e sem respostas genéricas.',
    values: [
      { title: 'Atendimento direto', text: 'Um responsável dedicado à sua conta.' },
      { title: 'Processos digitais', text: 'Documentos e relatórios online.' },
      { title: 'Prazo em dia', text: 'Obrigações entregues sem atraso.' },
    ],
    stats,
  },

  process: {
    /** Rótulo no canto dos painéis: "Como funciona · 01/03". */
    label: 'Como funciona',
    steps: {
      analysis: {
        name: 'Como ser um cliente da Stalo',
        eyebrow: 'Análise',
        title: 'O primeiro passo para uma gestão contábil',
        accent: 'inteligente e transformadora',
        text: 'Realizamos um diagnóstico completo da sua estrutura atual para identificar riscos, oportunidades e o melhor caminho estratégico para o seu crescimento.',
      },
      strategy: {
        name: 'Plano personalizado',
        eyebrow: 'Estratégia',
        title: 'Estratégia financeira',
        accent: 'desenhada para o seu negócio',
        text: 'Construímos um plano personalizado, combinando dados, tecnologia e visão consultiva para direcionar sua empresa ao próximo nível.',
      },
      support: {
        name: 'Acompanhamento contínuo',
        eyebrow: 'Suporte',
        title: 'Evolução guiada e',
        accent: 'constância na performance',
        text: 'Mantemos um acompanhamento próximo, analisando resultados, ajustando rotas e garantindo a execução precisa da estratégia para que seu negócio continue avançando com segurança e inteligência.',
      },
    },
  },

  results: {
    title: 'Resultados que transformam',
    accent: 'negócios.',
    lead: 'O que nossos clientes dizem.',
    starsLabel: '5 de 5 estrelas',
    quotes: {
      emanoel:
        'Com a Stalo descobrimos clareza, organização e previsibilidade. Hoje tomamos decisões com segurança e enxergamos nosso negócio de forma estratégica.',
      walex:
        'A Stalo trouxe inteligência, orientação e direção para nossa gestão. O que antes era confuso, agora é simples, estruturado e escalável.',
    },
  },

  faq: {
    title: 'Perguntas',
    accent: 'frequentes.',
    lead: 'Respostas rápidas e diretas sobre como trabalhamos.',
    cta: {
      title: 'Ainda tem dúvidas?',
      text: 'Nossos consultores estão prontos para esclarecer qualquer pergunta.',
    },
    items: [
      {
        q: 'A Stalo atende empresas de quais segmentos?',
        a: 'Atuamos com empresas que valorizam gestão inteligente — comércio, serviços, tecnologia, saúde, indústria e negócios em expansão que buscam dados, clareza e inteligência financeira.',
      },
      {
        q: 'Como funciona o processo de entrada de um novo cliente?',
        a: 'Iniciamos com um diagnóstico profundo para entender sua realidade, riscos e oportunidades. A partir disso, estruturamos um plano estratégico e iniciamos a transição assistida.',
      },
      {
        q: 'A Stalo oferece atendimento consultivo?',
        a: 'Sim. Toda a nossa operação é orientada por estratégia, análise e direcionamento. Mais do que números, entregamos visão e tomada de decisão.',
      },
      {
        q: 'Posso migrar minha contabilidade para a Stalo sem interromper minhas operações?',
        a: 'Sim. Realizamos uma migração organizada, segura e assistida, garantindo continuidade total das rotinas da sua empresa.',
      },
      {
        q: 'A Stalo trabalha com planejamento tributário?',
        a: 'Sim. Nossa área de Inteligência Tributária atua de forma estratégica, garantindo economia, segurança e otimização fiscal.',
      },
      {
        q: 'O que diferencia a Stalo de outros escritórios?',
        a: 'A união entre precisão técnica, inteligência consultiva, tecnologia e um posicionamento claro: contabilidade como direção estratégica, não apenas como obrigação.',
      },
    ],
  },

  /** Formulário de contato (Contact.tsx, hoje fora do App). */
  contactForm: {
    title: 'Vamos conversar sobre a sua empresa.',
    lead: 'Envie seus dados e retornamos em até um dia útil com uma proposta.',
    name: 'Nome',
    email: 'E-mail',
    company: 'Empresa / CNPJ',
    message: 'Como podemos ajudar?',
    submit: 'Enviar',
    sentTitle: 'Mensagem enviada.',
    sentText: 'Obrigado, entraremos em contato em breve.',
    again: 'Enviar outra',
  },

  footer: {
    links: {
      solutions: 'Soluções',
      portal: 'Portal do Cliente',
      process: 'Como Funciona',
      contact: 'Contato',
      faq: 'FAQ',
    },
  },

  /** Modal que convida para o WhatsApp depois de 2 min no site (ConsultantInvite.tsx). */
  invite: {
    title: 'Quer conversar com um',
    accent: 'consultor?',
    text: 'Tire suas dúvidas com um consultor da Stalo pelo WhatsApp e veja como podemos cuidar da contabilidade da sua empresa.',
    dismiss: 'Agora não',
    close: 'Fechar',
  },

  /** Banner de consentimento (CookieConsent.tsx); `policy` é o link no fim do texto. */
  cookies: {
    text: 'Usamos cookies de marketing (Pixel da Meta) para medir o resultado dos nossos anúncios. Eles só são ativados se você aceitar.',
    policy: 'Política de Privacidade',
    accept: 'Aceitar',
    reject: 'Recusar',
    manage: 'Preferências de cookies',
  },

  legal: {
    back: 'Voltar ao site',
    updated: 'Última atualização:',
  },
}

export type Dictionary = typeof ptBR
