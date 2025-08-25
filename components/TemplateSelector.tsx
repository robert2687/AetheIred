
import React from 'react';
import { DocumentTemplate } from '../types';
import { FileTextIcon } from './icons';

interface TemplateSelectorProps {
  templates: DocumentTemplate[];
  onSelectTemplate: (template: DocumentTemplate) => void;
}

const TemplateCard: React.FC<{template: DocumentTemplate, onSelect: () => void}> = ({ template, onSelect }) => (
    <div
        onClick={onSelect}
        className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer border border-slate-200 flex flex-col"
    >
        <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{template.displayName}</h3>
            <div className="p-2 bg-blue-50 rounded-full">
                <FileTextIcon className="w-6 h-6 text-blue-500" />
            </div>
        </div>
        <p className="text-sm text-slate-600 mt-2 flex-grow">{template.description}</p>
        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full mt-4 self-start">{template.category}</span>
    </div>
);


const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, onSelectTemplate }) => {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Create a New Document</h1>
        <p className="text-lg text-slate-600 mt-2">Choose a template to start drafting with AI assistance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} onSelect={() => onSelectTemplate(template)} />
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
