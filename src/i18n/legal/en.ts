import { company } from '../../data/company'
import type { LegalDoc, LegalDocs } from '../types'

/* Tradução de pt-BR.ts. Mudou o texto em português? Atualize aqui também. */

const notice =
  'This is a translation provided for convenience. In case of any discrepancy, the Portuguese version prevails.'

const privacy: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy Policy',
  updated: 'October 5, 2026',
  intro: `${company.name} respects your privacy. This policy explains which personal data we collect when you visit the website ${company.site} or get in touch with us, why we collect it, how we use it and what your rights are, in accordance with Brazil's General Data Protection Law (Law No. 13,709/2018, "LGPD").`,
  notice,
  sections: [
    {
      title: '1. Who we are',
      body: [
        `${company.name}, registered under CNPJ No. ${company.cnpj}, with headquarters at ${company.address}, ${company.city}, is the controller of the personal data processed through this website.`,
        `For any matter related to this policy or to your data, contact our data protection officer at ${company.email}.`,
      ],
    },
    {
      title: '2. What data we collect',
      body: [
        'We collect only what is necessary to respond to your contact and keep the website running:',
        [
          'Data you send us: name, email, phone number, company name or CNPJ and the content of your message, when you fill in a form, send an email or talk to us on WhatsApp.',
          'Browsing data: IP address, browser and device type, pages visited, date and time of access and the source of the visit, collected automatically by cookies and analytics tools.',
        ],
        'We do not collect sensitive data (such as health, religion or biometrics) through the website and we do not ask for this type of information.',
      ],
    },
    {
      title: '3. How we use the data',
      body: [
        [
          'To respond to your contact and prepare commercial proposals.',
          'To provide the contracted services and comply with accounting, tax and labor obligations.',
          'To send communications about our services, when you authorize it, with the option to unsubscribe at any time.',
          'To measure website usage, fix errors and improve the browsing experience.',
          'To comply with legal and regulatory obligations and exercise rights in administrative or judicial proceedings.',
        ],
      ],
    },
    {
      title: '4. Legal bases',
      body: [
        'We process your data based on the grounds set out in Article 7 of the LGPD, mainly:',
        [
          'Performance of a contract or of preliminary procedures at the request of the data subject (Art. 7, V), when responding to contacts and providing services.',
          'Compliance with a legal or regulatory obligation (Art. 7, II), in accounting and tax routines.',
          'Legitimate interest (Art. 7, IX), for security, analysis of website usage and improvement of our services, always respecting your expectations.',
          'Consent (Art. 7, I), for marketing communications and non-essential cookies.',
        ],
      ],
    },
    {
      title: '5. Cookies',
      body: [
        'Cookies are small files stored in your browser. We use essential cookies, which are necessary for the website to work, and analytics cookies, which help us understand how the website is used.',
        'With your consent, we also use marketing cookies from Meta (the Meta Pixel, used by Facebook and Instagram) to measure the results of our ads and show them to people who have already visited the website. These cookies are only activated after you accept the cookie notice; if you decline, nothing is loaded. You can change this choice at any time under “Cookie preferences”, in the website footer.',
        'You can also block or delete cookies in your browser settings. Blocking essential cookies may affect how some parts of the website work.',
      ],
    },
    {
      title: '6. Who we share data with',
      body: [
        'We do not sell your personal data. We share data only when necessary, with:',
        [
          'Technology providers that host the website, store emails and operate analytics tools and management systems, under confidentiality obligations.',
          'Meta Platforms (Facebook and Instagram), only if you accept marketing cookies: it receives browsing data, such as pages visited and clicks on contact buttons, for ad measurement.',
          'Public bodies and authorities, when required by law, regulation or court order.',
          'Partners and professionals involved in providing the contracted services, to the extent necessary.',
        ],
        'Some providers may be located outside Brazil. In those cases, we adopt the safeguards set out in the LGPD for international data transfers.',
      ],
    },
    {
      title: '7. How long we keep data',
      body: [
        'We keep data for as long as necessary for the purposes described in this policy. Data from contacts that do not lead to a contract is kept for up to 12 months. Client data is kept for the duration of the contractual relationship and, after it ends, for the periods required by accounting, tax and labor legislation, or for the applicable limitation period.',
        'At the end of these periods, data is securely deleted or anonymized.',
      ],
    },
    {
      title: '8. Your rights',
      body: [
        'Under Article 18 of the LGPD, you may at any time request:',
        [
          'Confirmation that processing exists and access to your data.',
          'Correction of incomplete, inaccurate or outdated data.',
          'Anonymization, blocking or deletion of data that is unnecessary or processed in breach of the law.',
          'Portability of your data to another provider, subject to commercial and industrial secrecy.',
          'Information about who we share your data with.',
          'Withdrawal of consent and deletion of the data processed on that basis.',
        ],
        `To exercise these rights, send an email to ${company.email}. We will respond within the period set by law and may ask for information to confirm your identity.`,
      ],
    },
    {
      title: '9. Security',
      body: [
        'We adopt appropriate technical and administrative measures to protect your data against unauthorized access, loss, alteration or improper disclosure, such as encryption in transit, access control and internal confidentiality policies.',
        'No system is completely secure. If a security incident occurs that may pose a relevant risk to you, we will notify the Brazilian National Data Protection Authority (ANPD) and the affected data subjects, as required by law.',
      ],
    },
    {
      title: '10. Links to other websites',
      body: [
        'Our website may contain links to third-party websites, such as social networks and WhatsApp. We are not responsible for the privacy practices of those websites. We recommend reading the policies of each one.',
      ],
    },
    {
      title: '11. Changes to this policy',
      body: [
        'We may update this policy to reflect legal changes or changes to our services. The current version will always be published on this page, with the date of the last update. Relevant changes will be communicated through our contact channels.',
      ],
    },
    {
      title: '12. Contact',
      body: [
        `Questions, requests or complaints about privacy can be sent to ${company.email} or made by phone at ${company.phone}. You may also file a complaint with the ANPD.`,
      ],
    },
  ],
}

const terms: LegalDoc = {
  slug: 'terms',
  title: 'Terms of Use',
  updated: 'October 2, 2026',
  intro: `These Terms of Use govern access to and use of the website ${company.site}, maintained by ${company.name}. By browsing the website, you agree to these terms. If you do not agree, please do not use the website.`,
  notice,
  sections: [
    {
      title: '1. Purpose',
      body: [
        `The website is informational and institutional: it presents the services of ${company.name} in the areas of accounting, payroll and HR, tax intelligence, financial BPO, tax recovery and advisory, and offers contact channels.`,
        'The information on the website does not constitute accounting, tax or legal advice. The provision of services depends on a specific contract signed between the parties.',
      ],
    },
    {
      title: '2. Use of the website',
      body: [
        'By using the website, you agree to:',
        [
          'Provide true, complete and up-to-date information in forms and contacts.',
          'Not use the website for unlawful purposes or in ways that violate the rights of third parties.',
          'Not attempt to access restricted areas, interfere with the operation of the website, insert malicious code or collect data by automated means without authorization.',
          'Not reproduce, copy or distribute the content of the website without prior written authorization.',
        ],
      ],
    },
    {
      title: '3. Intellectual property',
      body: [
        `All content on the website, including texts, brand, logo, images, layout, code and other elements, belongs to ${company.name} or its licensors and is protected by intellectual property law.`,
        'Client logos displayed on the website belong to their respective owners and are used with authorization, for reference purposes only.',
        'Viewing and printing the content for personal, non-commercial use is permitted. Any other use depends on express authorization.',
      ],
    },
    {
      title: '4. Client Portal',
      body: [
        'Access to the Client Portal is restricted to clients with a contract in force and their own credentials. The user is responsible for keeping their credentials confidential and for all activity carried out with them. In case of misuse, notify us immediately.',
        'Use of the portal may be subject to additional terms, made available in the system itself.',
      ],
    },
    {
      title: '5. Contact and proposals',
      body: [
        'Messages sent through the website’s channels are handled in accordance with our Privacy Policy. Sending a contact request does not create an obligation to contract for either party.',
        'Proposals, deadlines and prices provided through the contact channels are valid for the period stated in them and may be revised before the contract is signed.',
      ],
    },
    {
      title: '6. Availability and changes',
      body: [
        'We aim to keep the website continuously available, but we do not guarantee uninterrupted or error-free operation. We may suspend access, in whole or in part, for maintenance or security reasons.',
        'We may change the content, structure and features of the website at any time and without prior notice.',
      ],
    },
    {
      title: '7. Limitation of liability',
      body: [
        `To the fullest extent permitted by law, ${company.name} is not liable for:`,
        [
          'Decisions made on the basis of the general information on the website, without contracting services and a specific analysis of your case.',
          'Damage arising from unavailability, technical failures, viruses or unauthorized access beyond our reasonable control.',
          'Content, products or services of third-party websites accessed through links.',
        ],
      ],
    },
    {
      title: '8. Third-party links',
      body: [
        'The website may contain links to third-party websites and services, such as social networks and messaging apps. These links are provided for convenience only. We do not control or endorse the content of those websites, and their use is governed by the terms of each one.',
      ],
    },
    {
      title: '9. Privacy',
      body: [
        'The processing of personal data carried out through the website is described in our Privacy Policy, which forms part of these Terms of Use.',
      ],
    },
    {
      title: '10. Changes to these terms',
      body: [
        'We may update these terms at any time. The current version will always be published on this page, with the date of the last update. Continued use of the website after changes are published implies agreement with the new terms.',
      ],
    },
    {
      title: '11. Governing law and jurisdiction',
      body: [
        `These terms are governed by the laws of the Federative Republic of Brazil. The courts of ${company.city} are chosen to settle any dispute arising from the use of the website, to the exclusion of any other, however privileged, except where the law determines a different jurisdiction.`,
      ],
    },
    {
      title: '12. Contact',
      body: [`Questions about these terms can be sent to ${company.email} or made by phone at ${company.phone}.`],
    },
  ],
}

export const legalEn: LegalDocs = { privacy, terms }
