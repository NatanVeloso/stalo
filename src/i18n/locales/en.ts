import type { Dictionary } from './pt-BR'

/** Textos do site em inglês. Mesmas chaves de pt-BR.ts (o tipo `Dictionary` cobra). */
export const en: Dictionary = {
  meta: {
    title: 'Stalo Consulting — Clear accounting for companies that want to grow',
    description:
      'Stalo Consulting — clear accounting for companies that want to grow. Accounting, tax, payroll and HR, company formation, financial BPO and advisory.',
  },

  common: {
    home: 'Home',
    talkToAccountant: 'Talk to an accountant',
    talkToConsultant: 'Talk to a consultant',
    whatsappLabel: 'Chat on WhatsApp',
    whatsappMessage: 'Hello! I found Stalo through the website and would like to talk to a consultant.',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    rights: 'All rights reserved.',
  },

  nav: {
    services: 'Services',
    about: 'About',
    process: 'How it works',
    faq: 'FAQ',
    contact: 'Contact',
  },

  hero: {
    title: 'Clear accounting for companies that',
    accent: 'want to grow.',
    text: 'We take care of your company’s accounting, taxes and payroll, with close support and reports you can actually understand.',
    primaryCta: 'Request a proposal',
    secondaryCta: 'View services',
  },

  clients: {
    label: 'Companies that trust Stalo',
  },

  services: {
    title: 'Everything your company needs,',
    accent: 'in one place.',
    lead: 'From company registration to closing the books, with a team dedicated to your business.',
    cta: {
      title: 'Not sure where to start?',
      text: 'A consultant will point you to the right service for where your company is today.',
    },
    marquee: [
      'Accounting Management',
      'Payroll & HR',
      'Tax Intelligence',
      'Financial BPO',
      'Tax Recovery',
      'Success Intelligence',
    ],
    items: {
      accounting: {
        title: 'Accounting Management',
        text: 'Integrated, precise, data-driven accounting management. We deliver strategic reports, complete organization and a clear view for confident decisions and continuous growth.',
      },
      hr: {
        title: 'Payroll & HR Management',
        text: 'We run your entire labor routine with technical rigor and efficiency. We reduce risk, structure processes and ensure a smooth, reliable experience for your team.',
      },
      tax: {
        title: 'Tax Intelligence',
        text: 'We design tax strategies with a high degree of precision. We identify opportunities, mitigate risks and optimize your tax burden with legal certainty and an advisory mindset.',
      },
      bpo: {
        title: 'Financial BPO',
        text: 'We take over your financial operations with full control, standardization and transparency. You gain predictability, accurate numbers and time to focus on strategy.',
      },
      recovery: {
        title: 'Tax Review & Recovery',
        text: 'We dig deep into your tax history to find credits, fix inconsistencies and recover amounts paid in error — strengthening your financial health.',
      },
      success: {
        title: 'Success Intelligence',
        text: 'We closely track your business indicators to anticipate scenarios, guide decisions and drive performance. Ongoing strategy for sustainable growth and consistent results.',
      },
    },
  },

  about: {
    eyebrow: 'About Stalo',
    title: 'An accountant who knows your business',
    accent: 'by name.',
    lead: 'We work side by side with business owners, turning tax obligations into information you can use to decide. Every client has a dedicated contact, with no queues and no generic answers.',
    values: [
      { title: 'Direct service', text: 'One person dedicated to your account.' },
      { title: 'Digital processes', text: 'Documents and reports online.' },
      { title: 'Always on time', text: 'Obligations delivered without delay.' },
    ],
    stats: [
      { value: 95, suffix: '%', label: 'Client satisfaction rate' },
      { value: 1, suffix: 'B', label: 'In assets under advisory' },
      { prefix: '+', value: 300, label: 'Companies served', sub: 'That trust our accounting intelligence' },
    ],
  },

  process: {
    label: 'How it works',
    steps: {
      analysis: {
        name: 'How to become a Stalo client',
        eyebrow: 'Analysis',
        title: 'The first step toward',
        accent: 'smart, transformative accounting',
        text: 'We run a complete diagnosis of your current structure to identify risks, opportunities and the best strategic path for your growth.',
      },
      strategy: {
        name: 'Tailored plan',
        eyebrow: 'Strategy',
        title: 'A financial strategy',
        accent: 'designed for your business',
        text: 'We build a tailored plan, combining data, technology and an advisory mindset to take your company to the next level.',
      },
      support: {
        name: 'Ongoing follow-up',
        eyebrow: 'Support',
        title: 'Guided evolution and',
        accent: 'consistent performance',
        text: 'We stay close, analyzing results, adjusting course and making sure the strategy is executed precisely, so your business keeps moving forward with confidence and intelligence.',
      },
    },
  },

  results: {
    title: 'Results that transform',
    accent: 'businesses.',
    lead: 'What our clients say.',
    starsLabel: '5 out of 5 stars',
    quotes: {
      emanoel:
        'With Stalo we found clarity, organization and predictability. Today we make decisions with confidence and see our business strategically.',
      walex:
        'Stalo brought intelligence, guidance and direction to our management. What used to be confusing is now simple, structured and scalable.',
    },
  },

  faq: {
    title: 'Frequently asked',
    accent: 'questions.',
    lead: 'Quick, straightforward answers about how we work.',
    cta: {
      title: 'Still have questions?',
      text: 'Our consultants are ready to answer anything you need.',
    },
    items: [
      {
        q: 'Which industries does Stalo work with?',
        a: 'We work with companies that value smart management — retail, services, technology, healthcare, manufacturing and growing businesses looking for data, clarity and financial intelligence.',
      },
      {
        q: 'How does onboarding work for a new client?',
        a: 'We start with an in-depth diagnosis to understand your reality, risks and opportunities. From there, we structure a strategic plan and begin an assisted transition.',
      },
      {
        q: 'Does Stalo offer advisory services?',
        a: 'Yes. Our entire operation is driven by strategy, analysis and guidance. More than numbers, we deliver insight and support for decision-making.',
      },
      {
        q: 'Can I move my accounting to Stalo without interrupting my operations?',
        a: 'Yes. We carry out an organized, secure and assisted migration, ensuring full continuity of your company’s routines.',
      },
      {
        q: 'Does Stalo do tax planning?',
        a: 'Yes. Our Tax Intelligence team works strategically to deliver savings, security and tax optimization.',
      },
      {
        q: 'What sets Stalo apart from other firms?',
        a: 'The combination of technical precision, advisory intelligence, technology and a clear stance: accounting as strategic direction, not just an obligation.',
      },
    ],
  },

  contactForm: {
    title: 'Let’s talk about your company.',
    lead: 'Send us your details and we’ll get back to you within one business day with a proposal.',
    name: 'Name',
    email: 'Email',
    company: 'Company / Tax ID',
    message: 'How can we help?',
    submit: 'Send',
    sentTitle: 'Message sent.',
    sentText: 'Thank you, we’ll be in touch soon.',
    again: 'Send another',
  },

  footer: {
    links: {
      solutions: 'Solutions',
      portal: 'Client Portal',
      process: 'How It Works',
      contact: 'Contact',
      faq: 'FAQ',
    },
  },

  invite: {
    title: 'Want to talk to a',
    accent: 'consultant?',
    text: 'Ask a Stalo consultant your questions on WhatsApp and see how we can take care of your company’s accounting.',
    dismiss: 'Not now',
    close: 'Close',
  },

  cookies: {
    text: 'We use marketing cookies (Meta Pixel) to measure the results of our ads. They are only activated if you accept.',
    policy: 'Privacy Policy',
    accept: 'Accept',
    reject: 'Decline',
    manage: 'Cookie preferences',
  },

  legal: {
    back: 'Back to site',
    updated: 'Last updated:',
  },
}
