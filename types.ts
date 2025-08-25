export type MessageRole = 'user' | 'model';

export interface Message {
  role: MessageRole;
  text: string;
}

export interface TemplateInput {
  label: string;
  type: 'text' | 'textarea';
  placeholder: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  inputs: Record<string, TemplateInput>;
}

export type DocumentStatus = 'draft' | 'in_review' | 'final' | 'archived';

export interface Document {
  id: string;
  title: string;
  content: string;
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  templateId: string;
}
