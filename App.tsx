import React, { useState } from 'react';
import { DocumentTemplate, Document } from './types';
import Dashboard from './components/Dashboard';
import TemplateSelector from './components/TemplateSelector';
import DocumentForm from './components/DocumentForm';
import Editor from './components/Editor';
import { generateDraft } from './services/geminiService';
import { TEMPLATES, INITIAL_DOCUMENTS } from './data';
import { BrainIcon, FileTextIcon } from './components/icons';

type View =
  | { name: 'dashboard' }
  | { name: 'templateSelector' }
  | { name: 'documentForm'; template: DocumentTemplate }
  | { name: 'editor'; documentId: string };

const App: React.FC = () => {
  const [view, setView] = useState<View>({ name: 'dashboard' });
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateNew = () => {
    setError(null);
    setView({ name: 'templateSelector' });
  };

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setError(null);
    setView({ name: 'documentForm', template });
  };
  
  const handleSelectDocument = (document: Document) => {
    setError(null);
    setView({ name: 'editor', documentId: document.id });
  };
  
  const handleBackToDashboard = () => {
    setError(null);
    setView({ name: 'dashboard' });
  };
  
  const handleGenerate = async (template: DocumentTemplate, inputs: Record<string, string>) => {
    setIsGenerating(true);
    setError(null);
    try {
      const draft = await generateDraft(template, inputs);
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        title: draft.title,
        content: draft.content,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toLocaleString(),
        templateId: template.id,
      };
      setDocuments(prev => [newDoc, ...prev]);
      setView({ name: 'editor', documentId: newDoc.id });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during document generation.";
      setError(errorMessage);
      // Stay on the form view to show the error
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateDocument = (id: string, newContent: string) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === id ? { ...doc, content: newContent, updatedAt: new Date().toLocaleString() } : doc
    ));
  };
  
  const handleDeleteDocument = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
        setDocuments(docs => docs.filter(doc => doc.id !== id));
        if (view.name === 'editor' && view.documentId === id) {
            setView({ name: 'dashboard' });
        }
    }
  };

  const renderView = () => {
    switch (view.name) {
      case 'dashboard':
        return <Dashboard documents={documents} onCreateNew={handleCreateNew} onSelectDocument={handleSelectDocument} onDelete={handleDeleteDocument} />;
      case 'templateSelector':
        return <TemplateSelector templates={TEMPLATES} onSelectTemplate={handleSelectTemplate} />;
      case 'documentForm':
        return (
            <div>
                {error && <div className="m-8 p-4 bg-red-100 text-red-800 border border-red-300 rounded-md">{error}</div>}
                <DocumentForm template={view.template} onGenerate={(inputs) => handleGenerate(view.template, inputs)} isGenerating={isGenerating} />
            </div>
        );
      case 'editor':
        const doc = documents.find(d => d.id === view.documentId);
        if (!doc) {
            return <div className="p-8 text-center text-red-500">Error: Document not found. <button onClick={handleBackToDashboard} className="underline">Go back to dashboard.</button></div>
        }
        return <Editor document={doc} onBack={handleBackToDashboard} onUpdate={handleUpdateDocument} />;
      default:
        return <div>Unhandled view state</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <FileTextIcon className="w-7 h-7 text-blue-600" />
          <h1 className="ml-3 text-xl font-bold text-slate-800">Aethelred</h1>
        </div>
        <nav className="p-4">
            <button
                onClick={handleBackToDashboard}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-slate-700 hover:bg-slate-100"
            >
                Dashboard
            </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
