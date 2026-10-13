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
    team: 'Equipo',
    process: 'Cómo funciona',
    faq: 'FAQ',
    blog: 'Blog',
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
    more: 'Conoce nuestra historia',
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
    prev: 'Testimonio anterior',
    next: 'Siguiente testimonio',
    placeholderAuthor: 'Cliente Stalo',
    placeholders: [
      {
        text: 'Por primera vez cerramos el mes sabiendo exactamente cuánto sobró y por qué. El informe llega antes de que lo pidamos.',
        company: 'Comercio minorista',
      },
      {
        text: 'La migración fue tranquila: ninguna obligación se atrasó y en dos semanas el equipo ya hablaba directo con nuestro responsable.',
        company: 'Clínica de salud',
      },
      {
        text: 'La planificación tributaria pagó todo el año de honorarios en los primeros meses. Y con seguridad, sin improvisar.',
        company: 'Industria',
      },
      {
        text: 'Dejamos de decidir por el saldo del banco. Hoy tenemos proyección de caja y cada contratación se hace con números sobre la mesa.',
        company: 'Tecnología',
      },
      {
        text: 'La nómina se volvió una rutina invisible: todo a tiempo, sin retrabajo y sin sustos con la fiscalización.',
        company: 'Servicios',
      },
      {
        text: 'Recuperamos tributos que ni sabíamos que nos correspondían. El análisis del historial fue minucioso.',
        company: 'Construcción',
      },
      {
        text: 'La atención directa marca la diferencia: la respuesta viene de quien conoce nuestra operación, no de un mostrador.',
        company: 'Agronegocio',
      },
      {
        text: 'Los indicadores mensuales cambiaron la conversación entre los socios. Salimos de las suposiciones y pasamos a discutir estrategia.',
        company: 'Educación',
      },
    ],
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
      blog: 'Blog',
      about: 'Sobre nosotros',
      team: 'Equipo',
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

  blog: {
    morePosts: 'Otras publicaciones',
    eyebrow: 'Blog',
    pageTitle: 'Blog',
    title: 'Contenido directo de nuestro',
    accent: 'Instagram.',
    lead: 'Consejos, novedades y el detrás de escena de Stalo, publicados primero en Instagram y reunidos aquí.',
    viewAll: 'Ver todas las publicaciones',
    follow: 'Seguir en Instagram',
    readMore: 'Leer publicación',
    openOnInstagram: 'Abrir en Instagram',
    watchOnInstagram: 'Ver en Instagram',
    back: 'Volver al blog',
    loadMore: 'Cargar más',
    empty: 'Todavía no hay publicaciones.',
    error: 'No pudimos cargar las publicaciones ahora.',
    notFound: 'Publicación no encontrada.',
    video: 'Vídeo',
    carousel: 'Carrusel',
    likes: 'me gusta',
    comments: 'comentarios',
    originalLanguage: 'Publicación original en portugués.',
  },

  aboutPage: {
    pageTitle: 'Sobre nosotros',
    title: 'Contabilidad para quienes',
    accent: 'quieren decidir mejor.',
    lead: 'Desde 2018, en Goiânia, transformamos obligaciones fiscales en información clara para quienes dirigen una empresa.',
    primaryCta: 'Conoce al equipo',
    founded: 'Fundada el 30 de mayo de 2018, en Goiânia, Brasil.',
    years: '{anos} años acompañando empresas que crecen.',
    storyTitle: 'Una contabilidad que',
    storyAccent: 'explica los números.',
    story: [
      'Stalo nació de una convicción: el empresario necesita entender sus propios números, y no solo recibirlos a fin de mes.',
      'Por eso cada cliente tiene un responsable directo, que conoce la operación, se anticipa a los plazos y traduce informes en decisiones. Los procesos digitales se encargan del resto.',
      'Así atendemos comercio, servicios, tecnología, salud e industria: con rigor técnico, cercanía y visión de negocio.',
    ],
    missionLabel: 'Misión',
    mission: 'Dar claridad y seguridad a las decisiones de nuestros clientes, con una contabilidad precisa, cercana y orientada al crecimiento.',
    visionLabel: 'Visión',
    vision: 'Ser reconocida como la contabilidad consultiva de referencia para empresas en crecimiento en Brasil.',
    valuesTitle: 'Lo que guía',
    valuesAccent: 'cada entrega.',
    values: [
      { title: 'Claridad', text: 'Un número sin explicación no ayuda a nadie. Cada informe llega con lo que significa para tu empresa.' },
      { title: 'Cercanía', text: 'Un responsable que conoce tu negocio por su nombre y responde sin filas.' },
      { title: 'Rigor técnico', text: 'Plazos cumplidos, obligaciones al día y cada asiento revisado.' },
      { title: 'Ética', text: 'Planificación tributaria dentro de la ley, con transparencia sobre riesgos y costos.' },
      { title: 'Visión de dueño', text: 'Cuidamos la empresa del cliente con el mismo celo y la misma ambición de quien la fundó.' },
    ],
    placeTitle: 'Dónde estamos',
    placeMap: 'Ver en el mapa',
    ctaTitle: '¿Hablamos de tu empresa?',
    ctaText: 'Un consultor entiende tu momento e indica el camino correcto, sin compromiso.',
  },

  team: {
    pageTitle: 'Equipo',
    title: 'Las personas detrás',
    accent: 'de tus números.',
    lead: 'Especialistas en contabilidad, impuestos, nómina y finanzas, trabajando juntos para cada cliente.',
    howTitle: 'Un responsable directo.',
    howAccent: 'Un equipo entero detrás.',
    how: [
      { title: 'Hablas con una persona', text: 'Tu responsable conoce la operación y es tu canal único con Stalo.' },
      { title: 'Especialistas por área', text: 'Fiscal, nómina y finanzas entran cuando el tema pide profundidad técnica.' },
      { title: 'Una visión del conjunto', text: 'Todo converge en informes y reuniones que miran la empresa entera.' },
    ],
    areasTitle: 'Quién cuida',
    areasAccent: 'cada frente.',
    members: [
      { role: 'Socio fundador', area: 'Dirección', text: 'Define la estrategia de Stalo y acompaña de cerca las cuentas de mayor complejidad.' },
      { role: 'Coordinación contable', area: 'Contabilidad', text: 'Cierres, balances e informes de gestión que tienen sentido para quien decide.' },
      { role: 'Coordinación fiscal', area: 'Fiscal y tributario', text: 'Liquidaciones, obligaciones accesorias y planificación tributaria dentro de la ley.' },
      { role: 'Nómina y RR. HH.', area: 'Personas', text: 'Nómina, altas, bajas y eSocial sin retrasos y sin retrabajo.' },
      { role: 'BPO financiero', area: 'Finanzas', text: 'Cuentas por pagar y por cobrar, conciliación y flujo de caja bajo control.' },
      { role: 'Éxito del cliente', area: 'Relación', text: 'El responsable directo que conoce tu operación y acompaña cada entrega.' },
    ],
    noPhoto: 'Foto próximamente',
    joinTitle: '¿Quieres formar parte?',
    joinText: 'Siempre nos alegra conocer contadores y analistas a quienes les gustan las personas y los números.',
    joinCta: 'Enviar currículum',
    joinSubject: 'Quiero formar parte del equipo Stalo',
    aboutCta: 'Nuestra historia',
  },

  legal: {
    back: 'Volver al sitio',
    updated: 'Última actualización:',
  },
}
