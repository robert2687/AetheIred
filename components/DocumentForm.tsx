
import React, { useState } from 'react';
import { DocumentTemplate } from '../types';
import { SparkleIcon } from './icons';

interface DocumentFormProps {
  template: DocumentTemplate;
  onGenerate: (inputs: Record<string, string>) => void;
  isGenerating: boolean;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ template, onGenerate, isGenerating }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">{template.displayName}</h1>
        <p className="text-lg text-slate-600 mt-2">Please provide the initial details to generate your document.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow border border-slate-200 space-y-6">
        {Object.entries(template.inputs).map(([key, input]) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-slate-700 mb-1">{input.label}</label>
            {input.type === 'textarea' ? (
              <textarea
                id={key}
                name={key}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={input.placeholder}
                onChange={handleChange}
                required
              />
            ) : (
              <input
                type={input.type}
                id={key}
                name={key}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={input.placeholder}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed shadow-sm"
          >
            {isGenerating ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                </>
            ) : (
                <>
                    <SparkleIcon className="w-5 h-5"/>
                    Generate Draft
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;
