import { contact } from './content'

/** Parágrafo (string) ou lista de itens (string[]). */
export type LegalBlock = string | string[]
export type LegalSection = { title: string; body: LegalBlock[] }
export type LegalDoc = {
  slug: string
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

/* Dados da empresa. CNPJ e endereço precisam ser preenchidos antes de publicar. */
const company = {
  name: 'Stalo Consulting',
  cnpj: '[CNPJ]',
  address: '[endereço completo]',
  city: 'Goiânia/GO',
  email: contact.email,
  phone: contact.phone,
  site: 'staloconsulting.com.br',
}

export const privacy: LegalDoc = {
  slug: 'privacidade',
  title: 'Política de Privacidade',
  updated: '2 de outubro de 2026',
  intro: `A ${company.name} respeita a sua privacidade. Esta política explica quais dados pessoais coletamos quando você visita o site ${company.site} ou entra em contato conosco, por que coletamos, como usamos e quais são os seus direitos, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018, "LGPD").`,
  sections: [
    {
      title: '1. Quem somos',
      body: [
        `${company.name}, inscrita no CNPJ sob o nº ${company.cnpj}, com sede em ${company.address}, ${company.city}, é a controladora dos dados pessoais tratados por meio deste site.`,
        `Para qualquer assunto relacionado a esta política ou aos seus dados, fale com nosso encarregado de proteção de dados pelo e-mail ${company.email}.`,
      ],
    },
    {
      title: '2. Quais dados coletamos',
      body: [
        'Coletamos apenas o necessário para atender ao seu contato e manter o site funcionando:',
        [
          'Dados que você nos envia: nome, e-mail, telefone, nome da empresa ou CNPJ e o conteúdo da mensagem, quando preenche um formulário, envia um e-mail ou fala conosco pelo WhatsApp.',
          'Dados de navegação: endereço IP, tipo de navegador e dispositivo, páginas visitadas, data e hora de acesso e origem da visita, coletados automaticamente por cookies e ferramentas de análise.',
        ],
        'Não coletamos dados sensíveis (como saúde, religião ou biometria) por meio do site e não solicitamos esse tipo de informação.',
      ],
    },
    {
      title: '3. Para que usamos os dados',
      body: [
        [
          'Responder ao seu contato e elaborar propostas comerciais.',
          'Prestar os serviços contratados e cumprir obrigações contábeis, fiscais e trabalhistas.',
          'Enviar comunicações sobre nossos serviços, quando você autorizar, com opção de cancelamento a qualquer momento.',
          'Medir o uso do site, corrigir erros e melhorar a experiência de navegação.',
          'Cumprir obrigações legais e regulatórias e exercer direitos em processos administrativos ou judiciais.',
        ],
      ],
    },
    {
      title: '4. Bases legais',
      body: [
        'Tratamos seus dados com fundamento nas hipóteses previstas no art. 7º da LGPD, principalmente:',
        [
          'Execução de contrato ou de procedimentos preliminares a pedido do titular (art. 7º, V), ao responder contatos e prestar serviços.',
          'Cumprimento de obrigação legal ou regulatória (art. 7º, II), nas rotinas contábeis e fiscais.',
          'Legítimo interesse (art. 7º, IX), para segurança, análise de uso do site e aprimoramento dos serviços, sempre respeitando suas expectativas.',
          'Consentimento (art. 7º, I), para comunicações de marketing e cookies não essenciais.',
        ],
      ],
    },
    {
      title: '5. Cookies',
      body: [
        'Cookies são pequenos arquivos armazenados no seu navegador. Usamos cookies essenciais, necessários ao funcionamento do site, e cookies de análise, que nos ajudam a entender como o site é usado.',
        'Você pode bloquear ou apagar cookies nas configurações do seu navegador. Bloquear cookies essenciais pode afetar o funcionamento de algumas partes do site.',
      ],
    },
    {
      title: '6. Com quem compartilhamos',
      body: [
        'Não vendemos seus dados pessoais. Compartilhamos dados apenas quando necessário, com:',
        [
          'Fornecedores de tecnologia que hospedam o site, armazenam e-mails, operam ferramentas de análise e sistemas de gestão, sob obrigações de confidencialidade.',
          'Órgãos públicos e autoridades, quando exigido por lei, regulamento ou decisão judicial.',
          'Parceiros e profissionais envolvidos na prestação dos serviços contratados, no limite do necessário.',
        ],
        'Alguns fornecedores podem estar localizados fora do Brasil. Nesses casos, adotamos as salvaguardas previstas na LGPD para a transferência internacional de dados.',
      ],
    },
    {
      title: '7. Por quanto tempo guardamos',
      body: [
        'Mantemos os dados pelo tempo necessário às finalidades descritas nesta política. Dados de contatos que não evoluem para contratação são mantidos por até 12 meses. Dados de clientes são mantidos durante a relação contratual e, depois dela, pelos prazos exigidos pela legislação contábil, fiscal e trabalhista, ou pelo prazo prescricional aplicável.',
        'Ao fim desses prazos, os dados são excluídos ou anonimizados de forma segura.',
      ],
    },
    {
      title: '8. Seus direitos',
      body: [
        'Nos termos do art. 18 da LGPD, você pode, a qualquer momento, solicitar:',
        [
          'Confirmação da existência de tratamento e acesso aos seus dados.',
          'Correção de dados incompletos, inexatos ou desatualizados.',
          'Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei.',
          'Portabilidade dos dados a outro fornecedor, observados os segredos comercial e industrial.',
          'Informação sobre com quem compartilhamos seus dados.',
          'Revogação do consentimento e eliminação dos dados tratados com base nele.',
        ],
        `Para exercer esses direitos, envie um e-mail para ${company.email}. Responderemos no prazo previsto em lei e poderemos pedir informações para confirmar a sua identidade.`,
      ],
    },
    {
      title: '9. Segurança',
      body: [
        'Adotamos medidas técnicas e administrativas adequadas para proteger seus dados contra acessos não autorizados, perda, alteração ou divulgação indevida, como criptografia em trânsito, controle de acesso e políticas internas de confidencialidade.',
        'Nenhum sistema é totalmente seguro. Caso ocorra um incidente de segurança que possa causar risco relevante a você, comunicaremos o fato à Autoridade Nacional de Proteção de Dados (ANPD) e aos titulares afetados, conforme a lei.',
      ],
    },
    {
      title: '10. Links para outros sites',
      body: [
        'Nosso site pode conter links para sites de terceiros, como redes sociais e o WhatsApp. Não somos responsáveis pelas práticas de privacidade desses sites. Recomendamos a leitura das políticas de cada um.',
      ],
    },
    {
      title: '11. Alterações nesta política',
      body: [
        'Podemos atualizar esta política para refletir mudanças legais ou nos nossos serviços. A versão vigente estará sempre publicada nesta página, com a data da última atualização. Mudanças relevantes serão comunicadas pelos nossos canais de contato.',
      ],
    },
    {
      title: '12. Contato',
      body: [
        `Dúvidas, solicitações ou reclamações sobre privacidade podem ser enviadas para ${company.email} ou pelo telefone ${company.phone}. Você também pode apresentar reclamação à ANPD.`,
      ],
    },
  ],
}

export const terms: LegalDoc = {
  slug: 'termos',
  title: 'Termos de Uso',
  updated: '2 de outubro de 2026',
  intro: `Estes Termos de Uso regulam o acesso e a utilização do site ${company.site}, mantido pela ${company.name}. Ao navegar no site, você concorda com estes termos. Se não concordar, pedimos que não utilize o site.`,
  sections: [
    {
      title: '1. Objeto',
      body: [
        `O site tem caráter informativo e institucional: apresenta os serviços da ${company.name} nas áreas de contabilidade, departamento pessoal, inteligência tributária, BPO financeiro, recuperação de tributos e consultoria, e oferece canais de contato.`,
        'As informações do site não constituem consultoria contábil, fiscal ou jurídica. A prestação de serviços depende de contrato específico firmado entre as partes.',
      ],
    },
    {
      title: '2. Uso do site',
      body: [
        'Ao utilizar o site, você se compromete a:',
        [
          'Fornecer informações verdadeiras, completas e atualizadas nos formulários e contatos.',
          'Não utilizar o site para fins ilícitos ou que violem direitos de terceiros.',
          'Não tentar acessar áreas restritas, interferir no funcionamento do site, inserir códigos maliciosos ou coletar dados de forma automatizada sem autorização.',
          'Não reproduzir, copiar ou distribuir o conteúdo do site sem autorização prévia e por escrito.',
        ],
      ],
    },
    {
      title: '3. Propriedade intelectual',
      body: [
        `Todo o conteúdo do site, incluindo textos, marca, logotipo, imagens, layout, código e demais elementos, pertence à ${company.name} ou a seus licenciantes e é protegido pela legislação de propriedade intelectual.`,
        'Logotipos de clientes exibidos no site pertencem aos respectivos titulares e são utilizados com autorização, apenas para fins de referência.',
        'É permitida a visualização e a impressão do conteúdo para uso pessoal e não comercial. Qualquer outro uso depende de autorização expressa.',
      ],
    },
    {
      title: '4. Portal do Cliente',
      body: [
        'O acesso ao Portal do Cliente é restrito a clientes com contrato vigente e credenciais próprias. O usuário é responsável por manter suas credenciais em sigilo e por todas as atividades realizadas com elas. Em caso de uso indevido, comunique-nos imediatamente.',
        'O uso do portal pode estar sujeito a termos adicionais, disponibilizados no próprio sistema.',
      ],
    },
    {
      title: '5. Contato e propostas',
      body: [
        'As mensagens enviadas pelos canais do site são tratadas conforme a nossa Política de Privacidade. O envio de um contato não gera obrigação de contratação para nenhuma das partes.',
        'Propostas, prazos e valores informados nos canais de contato são válidos pelo período neles indicado e podem ser revisados antes da assinatura do contrato.',
      ],
    },
    {
      title: '6. Disponibilidade e alterações',
      body: [
        'Buscamos manter o site disponível de forma contínua, mas não garantimos funcionamento ininterrupto ou livre de erros. Podemos suspender o acesso, total ou parcialmente, para manutenção ou por motivos de segurança.',
        'Podemos alterar, a qualquer momento e sem aviso prévio, o conteúdo, a estrutura e as funcionalidades do site.',
      ],
    },
    {
      title: '7. Limitação de responsabilidade',
      body: [
        `Na máxima extensão permitida pela lei, a ${company.name} não se responsabiliza por:`,
        [
          'Decisões tomadas com base nas informações gerais do site, sem a contratação de serviços e a análise específica do seu caso.',
          'Danos decorrentes de indisponibilidade, falhas técnicas, vírus ou acessos não autorizados fora do nosso controle razoável.',
          'Conteúdo, produtos ou serviços de sites de terceiros acessados por meio de links.',
        ],
      ],
    },
    {
      title: '8. Links para terceiros',
      body: [
        'O site pode conter links para sites e serviços de terceiros, como redes sociais e aplicativos de mensagens. Esses links são oferecidos apenas por conveniência. Não controlamos nem endossamos o conteúdo desses sites, e o uso deles é regido pelos termos de cada um.',
      ],
    },
    {
      title: '9. Privacidade',
      body: [
        'O tratamento de dados pessoais realizado por meio do site é descrito na nossa Política de Privacidade, que integra estes Termos de Uso.',
      ],
    },
    {
      title: '10. Alterações destes termos',
      body: [
        'Podemos atualizar estes termos a qualquer momento. A versão vigente estará sempre publicada nesta página, com a data da última atualização. O uso continuado do site após a publicação de alterações implica concordância com os novos termos.',
      ],
    },
    {
      title: '11. Lei aplicável e foro',
      body: [
        `Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de ${company.city} para dirimir quaisquer controvérsias decorrentes do uso do site, com renúncia a qualquer outro, por mais privilegiado que seja, ressalvadas as hipóteses em que a lei determinar foro diverso.`,
      ],
    },
    {
      title: '12. Contato',
      body: [`Dúvidas sobre estes termos podem ser enviadas para ${company.email} ou pelo telefone ${company.phone}.`],
    },
  ],
}

export const legalDocs = { privacidade: privacy, termos: terms } as const
export type LegalSlug = keyof typeof legalDocs
