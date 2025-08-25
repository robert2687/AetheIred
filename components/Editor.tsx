import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Document } from '../types';
import { SparkleIcon } from './icons';

interface EditorProps {
  document: Document;
  onBack: () => void;
  onUpdate: (id: string, newContent: string) => void;
}

const Editor: React.FC<EditorProps> = ({ document, onBack, onUpdate }) => {
  const [content, setContent] = useState(document.content || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Sync local content state if the document prop changes
    setContent(document.content || '');
  }, [document.id, document.content]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate(document.id, newContent);
  };

  const handleAction = (action: string) => {
    alert(`Action triggered: ${action}. \nThis would call the AI Integration Service.`);
  };

  return (
    <div className="flex h-full bg-white">
      <div className="flex-grow p-8 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <div>
                 <button onClick={onBack} className="text-sm text-slate-600 hover:text-slate-900 mb-2">
                    &larr; Back to Dashboard
                </button>
                <h1 className="text-3xl font-bold text-slate-800">{document.title}</h1>
            </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center p-1 bg-slate-100 rounded-md">
                <button
                    onClick={() => setIsEditing(false)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${!isEditing ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
                    aria-pressed={!isEditing}
                >
                    Preview
                </button>
                <button
                    onClick={() => setIsEditing(true)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${isEditing ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}
                    aria-pressed={isEditing}
                >
                    Edit
                </button>
            </div>
            <span className="h-6 w-px bg-slate-200"></span>
            <button className="px-4 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-sm">Export</button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm">Save</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-inner border border-slate-200 flex-grow overflow-y-auto mt-2">
            {isEditing ? (
                <textarea
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="w-full h-full p-6 resize-none border-0 focus:ring-0 text-slate-800 leading-relaxed font-mono bg-transparent"
                    placeholder="Start writing your document..."
                    aria-label="Document Content Editor"
                />
            ) : (
                <article className="prose prose-slate max-w-none p-6">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </article>
            )}
        </div>
      </div>
      <aside className="w-80 bg-slate-50 border-l border-slate-200 p-6 flex-shrink-0">
        <h2 className="text-xl font-bold text-slate-800 mb-6">AI Assistant</h2>
        <div className="space-y-4">
          <AiActionButton icon={<SparkleIcon />} title="Refine Text" description="Improve clarity, tone, or conciseness of selected text." onClick={() => handleAction('Refine Text')} />
          <AiActionButton icon={<SparkleIcon />} title="Suggest Clauses" description="Get suggestions for relevant legal clauses based on context." onClick={() => handleAction('Suggest Clauses')} />
          <AiActionButton icon={<SparkleIcon />} title="Validate Document" description="Check for inconsistencies and potential risks." onClick={() => handleAction('Validate Document')} />
        </div>
      </aside>
    </div>
  );
};

interface AiActionButtonProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

const AiActionButton: React.FC<AiActionButtonProps> = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="w-full text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-slate-50 transition-all border border-slate-200"
    >
        <div className="flex items-center gap-3">
            <div className="text-blue-500">{icon}</div>
            <h3 className="text-md font-semibold text-slate-800">{title}</h3>
        </div>
        <p className="text-sm text-slate-600 mt-2">{description}</p>
    </button>
);


export default Editor;