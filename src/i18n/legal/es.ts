import { company } from '../../data/company'
import type { LegalDoc, LegalDocs } from '../types'

/* Tradução de pt-BR.ts. Mudou o texto em português? Atualize aqui também. */

const notice =
  'Esta es una traducción ofrecida para facilitar la lectura. En caso de divergencia, prevalece la versión en portugués.'

const privacy: LegalDoc = {
  slug: 'privacidad',
  title: 'Política de Privacidad',
  updated: '5 de octubre de 2026',
  intro: `${company.name} respeta tu privacidad. Esta política explica qué datos personales recopilamos cuando visitas el sitio ${company.site} o te pones en contacto con nosotros, por qué los recopilamos, cómo los usamos y cuáles son tus derechos, de conformidad con la Ley General de Protección de Datos Personales de Brasil (Ley n.º 13.709/2018, "LGPD").`,
  notice,
  sections: [
    {
      title: '1. Quiénes somos',
      body: [
        `${company.name}, inscrita en el CNPJ con el n.º ${company.cnpj}, con sede en ${company.address}, ${company.city}, es la responsable del tratamiento de los datos personales tratados a través de este sitio.`,
        `Para cualquier asunto relacionado con esta política o con tus datos, escribe a nuestro encargado de protección de datos al correo ${company.email}.`,
      ],
    },
    {
      title: '2. Qué datos recopilamos',
      body: [
        'Recopilamos solo lo necesario para atender tu contacto y mantener el sitio en funcionamiento:',
        [
          'Datos que nos envías: nombre, correo electrónico, teléfono, nombre de la empresa o CNPJ y el contenido del mensaje, cuando completas un formulario, envías un correo o hablas con nosotros por WhatsApp.',
          'Datos de navegación: dirección IP, tipo de navegador y dispositivo, páginas visitadas, fecha y hora de acceso y origen de la visita, recopilados automáticamente mediante cookies y herramientas de análisis.',
        ],
        'No recopilamos datos sensibles (como salud, religión o biometría) a través del sitio y no solicitamos ese tipo de información.',
      ],
    },
    {
      title: '3. Para qué usamos los datos',
      body: [
        [
          'Responder a tu contacto y elaborar propuestas comerciales.',
          'Prestar los servicios contratados y cumplir obligaciones contables, fiscales y laborales.',
          'Enviar comunicaciones sobre nuestros servicios, cuando lo autorices, con opción de cancelación en cualquier momento.',
          'Medir el uso del sitio, corregir errores y mejorar la experiencia de navegación.',
          'Cumplir obligaciones legales y regulatorias y ejercer derechos en procesos administrativos o judiciales.',
        ],
      ],
    },
    {
      title: '4. Bases legales',
      body: [
        'Tratamos tus datos con fundamento en las hipótesis previstas en el art. 7 de la LGPD, principalmente:',
        [
          'Ejecución de un contrato o de procedimientos preliminares a petición del titular (art. 7, V), al responder contactos y prestar servicios.',
          'Cumplimiento de una obligación legal o regulatoria (art. 7, II), en las rutinas contables y fiscales.',
          'Interés legítimo (art. 7, IX), para seguridad, análisis del uso del sitio y mejora de los servicios, respetando siempre tus expectativas.',
          'Consentimiento (art. 7, I), para comunicaciones de marketing y cookies no esenciales.',
        ],
      ],
    },
    {
      title: '5. Cookies',
      body: [
        'Las cookies son pequeños archivos almacenados en tu navegador. Usamos cookies esenciales, necesarias para el funcionamiento del sitio, y cookies de análisis, que nos ayudan a entender cómo se usa el sitio.',
        'Con tu consentimiento, usamos también cookies de marketing de Meta (el Píxel de Meta, utilizado por Facebook e Instagram) para medir el resultado de nuestros anuncios y mostrarlos a quienes ya visitaron el sitio. Estas cookies solo se activan después de que aceptas el aviso de cookies; si lo rechazas, no se carga nada. Puedes cambiar esta elección en cualquier momento en “Preferencias de cookies”, en el pie del sitio.',
        'También puedes bloquear o eliminar las cookies en la configuración de tu navegador. Bloquear las cookies esenciales puede afectar el funcionamiento de algunas partes del sitio.',
      ],
    },
    {
      title: '6. Con quién compartimos',
      body: [
        'No vendemos tus datos personales. Compartimos datos solo cuando es necesario, con:',
        [
          'Proveedores de tecnología que alojan el sitio, almacenan correos y operan herramientas de análisis y sistemas de gestión, bajo obligaciones de confidencialidad.',
          'Meta Platforms (Facebook e Instagram), solo si aceptas las cookies de marketing: recibe datos de navegación, como páginas visitadas y clics en los botones de contacto, para la medición de anuncios.',
          'Organismos públicos y autoridades, cuando lo exija la ley, un reglamento o una decisión judicial.',
          'Socios y profesionales que participan en la prestación de los servicios contratados, en la medida de lo necesario.',
        ],
        'Algunos proveedores pueden estar ubicados fuera de Brasil. En esos casos, adoptamos las salvaguardas previstas en la LGPD para la transferencia internacional de datos.',
      ],
    },
    {
      title: '7. Por cuánto tiempo los conservamos',
      body: [
        'Conservamos los datos durante el tiempo necesario para las finalidades descritas en esta política. Los datos de contactos que no llegan a una contratación se conservan hasta 12 meses. Los datos de clientes se conservan durante la relación contractual y, después de ella, por los plazos exigidos por la legislación contable, fiscal y laboral, o por el plazo de prescripción aplicable.',
        'Al final de esos plazos, los datos se eliminan o se anonimizan de forma segura.',
      ],
    },
    {
      title: '8. Tus derechos',
      body: [
        'De acuerdo con el art. 18 de la LGPD, puedes solicitar en cualquier momento:',
        [
          'Confirmación de la existencia del tratamiento y acceso a tus datos.',
          'Corrección de datos incompletos, inexactos o desactualizados.',
          'Anonimización, bloqueo o eliminación de datos innecesarios o tratados en disconformidad con la ley.',
          'Portabilidad de los datos a otro proveedor, respetando los secretos comercial e industrial.',
          'Información sobre con quién compartimos tus datos.',
          'Revocación del consentimiento y eliminación de los datos tratados con base en él.',
        ],
        `Para ejercer estos derechos, envía un correo a ${company.email}. Responderemos en el plazo previsto por la ley y podremos pedir información para confirmar tu identidad.`,
      ],
    },
    {
      title: '9. Seguridad',
      body: [
        'Adoptamos medidas técnicas y administrativas adecuadas para proteger tus datos contra accesos no autorizados, pérdida, alteración o divulgación indebida, como cifrado en tránsito, control de acceso y políticas internas de confidencialidad.',
        'Ningún sistema es totalmente seguro. Si ocurre un incidente de seguridad que pueda suponer un riesgo relevante para ti, lo comunicaremos a la Autoridad Nacional de Protección de Datos de Brasil (ANPD) y a los titulares afectados, conforme a la ley.',
      ],
    },
    {
      title: '10. Enlaces a otros sitios',
      body: [
        'Nuestro sitio puede contener enlaces a sitios de terceros, como redes sociales y WhatsApp. No somos responsables de las prácticas de privacidad de esos sitios. Recomendamos leer las políticas de cada uno.',
      ],
    },
    {
      title: '11. Cambios en esta política',
      body: [
        'Podemos actualizar esta política para reflejar cambios legales o en nuestros servicios. La versión vigente estará siempre publicada en esta página, con la fecha de la última actualización. Los cambios relevantes se comunicarán por nuestros canales de contacto.',
      ],
    },
    {
      title: '12. Contacto',
      body: [
        `Las dudas, solicitudes o reclamaciones sobre privacidad pueden enviarse a ${company.email} o hacerse por teléfono al ${company.phone}. También puedes presentar una reclamación ante la ANPD.`,
      ],
    },
  ],
}

const terms: LegalDoc = {
  slug: 'terminos',
  title: 'Términos de Uso',
  updated: '2 de octubre de 2026',
  intro: `Estos Términos de Uso regulan el acceso y la utilización del sitio ${company.site}, mantenido por ${company.name}. Al navegar por el sitio, aceptas estos términos. Si no estás de acuerdo, te pedimos que no utilices el sitio.`,
  notice,
  sections: [
    {
      title: '1. Objeto',
      body: [
        `El sitio tiene carácter informativo e institucional: presenta los servicios de ${company.name} en las áreas de contabilidad, nómina y RR. HH., inteligencia tributaria, BPO financiero, recuperación de tributos y consultoría, y ofrece canales de contacto.`,
        'La información del sitio no constituye asesoría contable, fiscal ni jurídica. La prestación de servicios depende de un contrato específico firmado entre las partes.',
      ],
    },
    {
      title: '2. Uso del sitio',
      body: [
        'Al utilizar el sitio, te comprometes a:',
        [
          'Proporcionar información verdadera, completa y actualizada en los formularios y contactos.',
          'No utilizar el sitio para fines ilícitos o que vulneren derechos de terceros.',
          'No intentar acceder a áreas restringidas, interferir en el funcionamiento del sitio, insertar código malicioso ni recopilar datos de forma automatizada sin autorización.',
          'No reproducir, copiar ni distribuir el contenido del sitio sin autorización previa y por escrito.',
        ],
      ],
    },
    {
      title: '3. Propiedad intelectual',
      body: [
        `Todo el contenido del sitio, incluidos textos, marca, logotipo, imágenes, diseño, código y demás elementos, pertenece a ${company.name} o a sus licenciantes y está protegido por la legislación de propiedad intelectual.`,
        'Los logotipos de clientes que aparecen en el sitio pertenecen a sus respectivos titulares y se utilizan con autorización, solo como referencia.',
        'Se permite visualizar e imprimir el contenido para uso personal y no comercial. Cualquier otro uso depende de autorización expresa.',
      ],
    },
    {
      title: '4. Portal del Cliente',
      body: [
        'El acceso al Portal del Cliente está restringido a clientes con contrato vigente y credenciales propias. El usuario es responsable de mantener sus credenciales en secreto y de todas las actividades realizadas con ellas. En caso de uso indebido, avísanos de inmediato.',
        'El uso del portal puede estar sujeto a términos adicionales, disponibles en el propio sistema.',
      ],
    },
    {
      title: '5. Contacto y propuestas',
      body: [
        'Los mensajes enviados por los canales del sitio se tratan conforme a nuestra Política de Privacidad. El envío de un contacto no genera obligación de contratación para ninguna de las partes.',
        'Las propuestas, plazos y valores informados en los canales de contacto son válidos durante el período indicado en ellos y pueden revisarse antes de la firma del contrato.',
      ],
    },
    {
      title: '6. Disponibilidad y cambios',
      body: [
        'Procuramos mantener el sitio disponible de forma continua, pero no garantizamos un funcionamiento ininterrumpido ni libre de errores. Podemos suspender el acceso, total o parcialmente, por mantenimiento o por motivos de seguridad.',
        'Podemos modificar, en cualquier momento y sin previo aviso, el contenido, la estructura y las funcionalidades del sitio.',
      ],
    },
    {
      title: '7. Limitación de responsabilidad',
      body: [
        `En la máxima medida permitida por la ley, ${company.name} no se hace responsable de:`,
        [
          'Decisiones tomadas con base en la información general del sitio, sin la contratación de servicios y el análisis específico de tu caso.',
          'Daños derivados de indisponibilidad, fallos técnicos, virus o accesos no autorizados fuera de nuestro control razonable.',
          'Contenido, productos o servicios de sitios de terceros a los que se accede mediante enlaces.',
        ],
      ],
    },
    {
      title: '8. Enlaces a terceros',
      body: [
        'El sitio puede contener enlaces a sitios y servicios de terceros, como redes sociales y aplicaciones de mensajería. Estos enlaces se ofrecen solo por conveniencia. No controlamos ni respaldamos el contenido de esos sitios, y su uso se rige por los términos de cada uno.',
      ],
    },
    {
      title: '9. Privacidad',
      body: [
        'El tratamiento de datos personales realizado a través del sitio se describe en nuestra Política de Privacidad, que forma parte de estos Términos de Uso.',
      ],
    },
    {
      title: '10. Cambios en estos términos',
      body: [
        'Podemos actualizar estos términos en cualquier momento. La versión vigente estará siempre publicada en esta página, con la fecha de la última actualización. El uso continuado del sitio después de la publicación de cambios implica la aceptación de los nuevos términos.',
      ],
    },
    {
      title: '11. Ley aplicable y jurisdicción',
      body: [
        `Estos términos se rigen por las leyes de la República Federativa de Brasil. Se elige el fuero de la comarca de ${company.city} para resolver cualquier controversia derivada del uso del sitio, con renuncia a cualquier otro, por más privilegiado que sea, salvo los casos en que la ley determine un fuero distinto.`,
      ],
    },
    {
      title: '12. Contacto',
      body: [`Las dudas sobre estos términos pueden enviarse a ${company.email} o hacerse por teléfono al ${company.phone}.`],
    },
  ],
}

export const legalEs: LegalDocs = { privacy, terms }
