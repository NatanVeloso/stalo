import type { Dictionary } from './pt-BR'

/** Textos do site em espanhol. Mesmas chaves de pt-BR.ts (o tipo `Dictionary` cobra). */
export const es: Dictionary = {
  meta: {
    title: 'Stalo Consulting — Contabilidad clara para empresas que quieren crecer',
    description:
      'Stalo Consulting — contabilidad clara para empresas que quieren crecer. Contabilidad, impuestos, nómina y RR. HH., apertura de empresas, BPO financiero y consultoría.',
  },

  common: {
    home: 'Inicio',
    talkToAccountant: 'Habla con un contador',
    talkToConsultant: 'Habla con un consultor',
    whatsappLabel: 'Hablar por WhatsApp',
    whatsappMessage: '¡Hola! Vengo del sitio de Stalo y quiero hablar con un consultor.',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    language: 'Idioma',
    rights: 'Todos los derechos reservados.',
  },

  nav: {
    services: 'Servicios',
    about: 'Nosotros',
    process: 'Cómo funciona',
    faq: 'FAQ',
    contact: 'Contacto',
  },

  hero: {
    title: 'Contabilidad clara para empresas que',
    accent: 'quieren crecer.',
    text: 'Nos ocupamos de la contabilidad, los impuestos y la nómina de tu empresa, con atención cercana e informes que entiendes.',
    primaryCta: 'Solicitar propuesta',
    secondaryCta: 'Ver servicios',
  },

  clients: {
    label: 'Empresas que confían en Stalo',
  },

  services: {
    title: 'Todo lo que tu empresa necesita,',
    accent: 'en un solo lugar.',
    lead: 'Desde el registro de la empresa hasta el cierre del balance, con un equipo dedicado a tu negocio.',
    cta: {
      title: '¿No sabes por dónde empezar?',
      text: 'Un consultor te indica el servicio adecuado para el momento de tu empresa.',
    },
    marquee: [
      'Gestión Contable',
      'Nómina y RR. HH.',
      'Inteligencia Tributaria',
      'BPO Financiero',
      'Recuperación de Tributos',
      'Inteligencia de Éxito',
    ],
    items: {
      accounting: {
        title: 'Gestión Contable',
        text: 'Una gestión contable integrada, precisa y orientada por datos. Entregamos informes estratégicos, organización total y una visión clara para decisiones seguras y crecimiento continuo.',
      },
      hr: {
        title: 'Gestión de Nómina y RR. HH.',
        text: 'Ejecutamos toda la rutina laboral con rigor técnico y eficiencia. Reducimos riesgos, estructuramos procesos y garantizamos una experiencia fluida y confiable para tu equipo.',
      },
      tax: {
        title: 'Inteligencia Tributaria',
        text: 'Estructuramos estrategias fiscales con un alto nivel de precisión. Identificamos oportunidades, mitigamos los riesgos y optimizamos la carga tributaria con seguridad jurídica y visión consultiva.',
      },
      bpo: {
        title: 'BPO Financiero',
        text: 'Asumimos tu operación financiera con control absoluto, estandarización y transparencia. Ganas previsibilidad, precisión en los números y tiempo para enfocarte en lo estratégico.',
      },
      recovery: {
        title: 'Revisión y Recuperación de Tributos',
        text: 'Analizamos en profundidad tu historial fiscal para encontrar créditos, corregir inconsistencias y recuperar valores pagados indebidamente — fortaleciendo tu salud financiera.',
      },
      success: {
        title: 'Inteligencia de Éxito',
        text: 'Seguimos de cerca los indicadores de tu negocio para anticipar escenarios, orientar decisiones e impulsar el rendimiento. Estrategia continua para un crecimiento sostenible y resultados consistentes.',
      },
    },
  },

  about: {
    eyebrow: 'Sobre Stalo',
    title: 'Un contador que conoce tu negocio',
    accent: 'por su nombre.',
    lead: 'Trabajamos codo a codo con empresarios, transformando obligaciones fiscales en información útil para decidir. Cada cliente tiene un responsable directo, sin filas y sin respuestas genéricas.',
    values: [
      { title: 'Atención directa', text: 'Un responsable dedicado a tu cuenta.' },
      { title: 'Procesos digitales', text: 'Documentos e informes en línea.' },
      { title: 'Plazos al día', text: 'Obligaciones entregadas sin retraso.' },
    ],
    stats: [
      { value: 95, suffix: '%', label: 'Índice de satisfacción de los clientes' },
      // "1 BI" em português = mil millones em espanhol (billón seria um trilhão)
      { value: 1000, suffix: 'M', label: 'En activos acompañados' },
      { prefix: '+', value: 300, label: 'Empresas atendidas', sub: 'Que confían en nuestra inteligencia contable' },
    ],
  },

  process: {
    label: 'Cómo funciona',
    steps: {
      analysis: {
        name: 'Cómo ser cliente de Stalo',
        eyebrow: 'Análisis',
        title: 'El primer paso hacia una gestión contable',
        accent: 'inteligente y transformadora',
        text: 'Realizamos un diagnóstico completo de tu estructura actual para identificar riesgos, oportunidades y el mejor camino estratégico para tu crecimiento.',
      },
      strategy: {
        name: 'Plan personalizado',
        eyebrow: 'Estrategia',
        title: 'Estrategia financiera',
        accent: 'diseñada para tu negocio',
        text: 'Construimos un plan personalizado, combinando datos, tecnología y visión consultiva para llevar tu empresa al siguiente nivel.',
      },
      support: {
        name: 'Acompañamiento continuo',
        eyebrow: 'Soporte',
        title: 'Evolución guiada y',
        accent: 'constancia en el rendimiento',
        text: 'Mantenemos un acompañamiento cercano, analizando resultados, ajustando el rumbo y garantizando la ejecución precisa de la estrategia para que tu negocio siga avanzando con seguridad e inteligencia.',
      },
    },
  },

  results: {
    title: 'Resultados que transforman',
    accent: 'negocios.',
    lead: 'Lo que dicen nuestros clientes.',
    starsLabel: '5 de 5 estrellas',
    quotes: {
      emanoel:
        'Con Stalo descubrimos claridad, organización y previsibilidad. Hoy tomamos decisiones con seguridad y vemos nuestro negocio de forma estratégica.',
      walex:
        'Stalo trajo inteligencia, orientación y dirección a nuestra gestión. Lo que antes era confuso ahora es simple, estructurado y escalable.',
    },
  },

  faq: {
    title: 'Preguntas',
    accent: 'frecuentes.',
    lead: 'Respuestas rápidas y directas sobre cómo trabajamos.',
    cta: {
      title: '¿Aún tienes dudas?',
      text: 'Nuestros consultores están listos para aclarar cualquier pregunta.',
    },
    items: [
      {
        q: '¿A empresas de qué sectores atiende Stalo?',
        a: 'Trabajamos con empresas que valoran la gestión inteligente — comercio, servicios, tecnología, salud, industria y negocios en expansión que buscan datos, claridad e inteligencia financiera.',
      },
      {
        q: '¿Cómo funciona el proceso de entrada de un nuevo cliente?',
        a: 'Empezamos con un diagnóstico profundo para entender tu realidad, riesgos y oportunidades. A partir de ahí, estructuramos un plan estratégico e iniciamos la transición asistida.',
      },
      {
        q: '¿Stalo ofrece atención consultiva?',
        a: 'Sí. Toda nuestra operación está orientada por estrategia, análisis y dirección. Más que números, entregamos visión y apoyo para la toma de decisiones.',
      },
      {
        q: '¿Puedo migrar mi contabilidad a Stalo sin interrumpir mis operaciones?',
        a: 'Sí. Realizamos una migración organizada, segura y asistida, garantizando la continuidad total de las rutinas de tu empresa.',
      },
      {
        q: '¿Stalo trabaja con planificación tributaria?',
        a: 'Sí. Nuestra área de Inteligencia Tributaria actúa de forma estratégica, garantizando ahorro, seguridad y optimización fiscal.',
      },
      {
        q: '¿Qué diferencia a Stalo de otros despachos?',
        a: 'La unión de precisión técnica, inteligencia consultiva, tecnología y un posicionamiento claro: la contabilidad como dirección estratégica, no solo como obligación.',
      },
    ],
  },

  contactForm: {
    title: 'Hablemos de tu empresa.',
    lead: 'Envía tus datos y te respondemos en un día hábil con una propuesta.',
    name: 'Nombre',
    email: 'Correo electrónico',
    company: 'Empresa / CNPJ',
    message: '¿Cómo podemos ayudarte?',
    submit: 'Enviar',
    sentTitle: 'Mensaje enviado.',
    sentText: 'Gracias, nos pondremos en contacto pronto.',
    again: 'Enviar otro',
  },

  footer: {
    links: {
      solutions: 'Soluciones',
      portal: 'Portal del Cliente',
      process: 'Cómo Funciona',
      contact: 'Contacto',
      faq: 'FAQ',
    },
  },

  invite: {
    title: '¿Quieres hablar con un',
    accent: 'consultor?',
    text: 'Resuelve tus dudas con un consultor de Stalo por WhatsApp y descubre cómo podemos ocuparnos de la contabilidad de tu empresa.',
    dismiss: 'Ahora no',
    close: 'Cerrar',
  },

  cookies: {
    text: 'Usamos cookies de marketing (Píxel de Meta) para medir el resultado de nuestros anuncios. Solo se activan si aceptas.',
    policy: 'Política de Privacidad',
    accept: 'Aceptar',
    reject: 'Rechazar',
    manage: 'Preferencias de cookies',
  },

  legal: {
    back: 'Volver al sitio',
    updated: 'Última actualización:',
  },
}
