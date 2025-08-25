import { DocumentTemplate, Document } from './types';

export const TEMPLATES: DocumentTemplate[] = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    displayName: 'Non-Disclosure Agreement (NDA)',
    description: 'A standard mutual non-disclosure agreement to protect confidential information shared between two parties.',
    category: 'Business',
    inputs: {
      disclosingParty: { label: 'Disclosing Party Name', type: 'text', placeholder: 'e.g., Acme Corporation' },
      receivingParty: { label: 'Receiving Party Name', type: 'text', placeholder: 'e.g., Innovate LLC' },
      effectiveDate: { label: 'Effective Date', type: 'text', placeholder: 'e.g., December 1st, 2023' },
      purpose: { label: 'Purpose of Disclosure', type: 'textarea', placeholder: 'e.g., To evaluate a potential business relationship.' },
    },
  },
  {
    id: 'consulting',
    name: 'Consulting Agreement',
    displayName: 'Consulting Agreement',
    description: 'A contract for engaging a consultant for a specific project, outlining scope, payment, and terms.',
    category: 'Services',
    inputs: {
      clientName: { label: 'Client Name', type: 'text', placeholder: 'e.g., Globex Inc.' },
      consultantName: { label: 'Consultant Name', type: 'text', placeholder: 'e.g., Jane Doe' },
      services: { label: 'Description of Services', type: 'textarea', placeholder: 'e.g., Provide marketing strategy consulting...' },
      compensation: { label: 'Compensation', type: 'text', placeholder: 'e.g., $5,000 USD' },
    },
  },
  {
    id: 'cease-and-desist',
    name: 'Cease and Desist Letter',
    displayName: 'Cease and Desist Letter',
    description: 'A formal letter demanding that the recipient stop an illegal or allegedly infringing activity.',
    category: 'Legal',
    inputs: {
        recipientName: { label: 'Recipient Name', type: 'text', placeholder: 'e.g., Infringer Co.' },
        senderName: { label: 'Your/Your Client\'s Name', type: 'text', placeholder: 'e.g., Rightsholder Ltd.' },
        infringingActivity: { label: 'Description of Infringing Activity', type: 'textarea', placeholder: 'e.g., Unauthorized use of copyrighted images on their website.' },
    },
  },
];


export const INITIAL_DOCUMENTS: Document[] = [
    {
        id: 'doc-1',
        title: 'NDA between Stark Industries and Wayne Enterprises',
        content: '## MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis agreement is made on **October 26, 2023** between **Stark Industries** and **Wayne Enterprises**.\n\n### 1. Purpose\n\nThe parties wish to explore a potential business relationship...',
        status: 'in_review',
        createdAt: '2023-10-26T10:00:00Z',
        updatedAt: 'October 26, 2023',
        templateId: 'nda',
    },
    {
        id: 'doc-2',
        title: 'Consulting Agreement for Diana Prince',
        content: '## CONSULTING SERVICES AGREEMENT\n\nThis agreement outlines the consulting services to be provided by **Diana Prince** to **ARGUS**.\n\n### Scope of Work\n\n- Provide expertise on ancient artifacts.\n- Assist in threat assessment.',
        status: 'draft',
        createdAt: '2023-11-15T09:00:00Z',
        updatedAt: 'November 16, 2023',
        templateId: 'consulting',
    }
];
