import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Document } from '../types';
import { SparkleIcon, SpinnerIcon, XIcon, ChevronDownIcon } from './icons';
import { refineText, RefineStyle } from '../services/geminiService';

interface EditorProps {
  document: Document;
  onBack: () => void;
  onUpdate: (id: string, newContent: string) => void;
}

const Editor: React.FC<EditorProps> = ({ document, onBack, onUpdate }) => {
  const [content, setContent] = useState(document.content || '');
  const [isEditing, setIsEditing] = useState(false);

  // State for AI Refine feature
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [refiningStyle, setRefiningStyle] = useState<RefineStyle | null>(null);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);
  const [refinedText, setRefinedText] = useState('');
  const [refineError, setRefineError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(document.content || '');
  }, [document.id, document.content]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate(document.id, newContent);
  };
  
  const handleSelectionChange = () => {
    const textarea = textareaRef.current;
    if (textarea && isEditing) {
      const { selectionStart, selectionEnd } = textarea;
      if (selectionStart !== selectionEnd) {
        setSelectedText(textarea.value.substring(selectionStart, selectionEnd));
        setSelectionRange({ start: selectionStart, end: selectionEnd });
      } else {
        setSelectedText('');
        setSelectionRange(null);
      }
    } else {
        setSelectedText('');
        setSelectionRange(null);
    }
  };

  const handleRefineText = async (style: RefineStyle) => {
    if (!selectedText) return;
    setRefiningStyle(style);
    setRefineError(null);
    try {
      const result = await refineText(selectedText, style);
      setRefinedText(result);
      setIsRefineModalOpen(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setRefineError(message);
      alert(`Refine Error: ${message}`); // Simple error feedback
    } finally {
      setRefiningStyle(null);
    }
  };

  const handleAcceptRefinement = () => {
    if (selectionRange) {
        const newContent = 
            content.substring(0, selectionRange.start) +
            refinedText +
            content.substring(selectionRange.end);
        handleContentChange(newContent);
    }
    closeRefineModal();
  };
  
  const closeRefineModal = () => {
      setIsRefineModalOpen(false);
      setRefinedText('');
      if(textareaRef.current) {
          textareaRef.current.focus();
      }
  };

  const handleAction = (action: string) => {
    alert(`Action triggered: ${action}. \nThis would call the AI Integration Service.`);
  };

  return (
    <>
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
                      ref={textareaRef}
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      onSelect={handleSelectionChange}
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
            <AiRefineAction
                onRefine={handleRefineText}
                disabled={!selectedText || !isEditing}
                refiningStyle={refiningStyle}
            />
            <AiActionButton icon={<SparkleIcon className="w-5 h-5"/>} title="Suggest Clauses" description="Get suggestions for relevant legal clauses based on context." onClick={() => handleAction('Suggest Clauses')} />
            <AiActionButton icon={<SparkleIcon className="w-5 h-5"/>} title="Validate Document" description="Check for inconsistencies and potential risks." onClick={() => handleAction('Validate Document')} />
          </div>
        </aside>
      </div>

      {isRefineModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full transform transition-all">
                  <div className="p-6 flex justify-between items-center border-b border-slate-200">
                      <h2 className="text-xl font-bold text-slate-800">Refine Suggestion</h2>
                      <button onClick={closeRefineModal} className="text-slate-500 hover:text-slate-800" aria-label="Close">
                          <XIcon className="w-6 h-6"/>
                      </button>
                  </div>
                  <div className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                          <div>
                              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Original</h3>
                              <div className="bg-slate-50 rounded-md p-4 h-64 overflow-y-auto text-sm border border-slate-200">
                                  <pre className="whitespace-pre-wrap font-mono">{selectedText}</pre>
                              </div>
                          </div>
                           <div>
                              <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wider mb-2">Suggestion</h3>
                              <div className="bg-green-50 rounded-md p-4 h-64 overflow-y-auto text-sm border border-green-200">
                                  <pre className="whitespace-pre-wrap font-mono">{refinedText}</pre>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="px-6 py-4 bg-slate-50 rounded-b-xl flex justify-end items-center gap-4">
                        <button onClick={closeRefineModal} className="px-4 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-sm">Cancel</button>
                        <button onClick={handleAcceptRefinement} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm">Accept Suggestion</button>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

interface AiActionButtonProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
    isProcessing?: boolean;
}

const AiActionButton: React.FC<AiActionButtonProps> = ({ icon, title, description, onClick, disabled, isProcessing }) => (
    <button
        onClick={onClick}
        disabled={disabled || isProcessing}
        className="w-full text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-slate-50 transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:bg-white"
        aria-live="polite"
    >
        <div className="flex items-center gap-3">
            <div className="text-blue-500 w-5 h-5 flex items-center justify-center">
                {isProcessing ? <SpinnerIcon className="animate-spin" /> : icon}
            </div>
            <h3 className="text-md font-semibold text-slate-800">{isProcessing ? 'Processing...' : title}</h3>
        </div>
        <p className="text-sm text-slate-600 mt-2">{description}</p>
    </button>
);

const refineStyles: { id: RefineStyle; label: string; description: string }[] = [
    { id: 'concise', label: 'More Concise', description: 'Shorten and clarify.' },
    { id: 'formal', label: 'More Formal', description: 'Use professional legal phrasing.' },
    { id: 'simple', label: 'Simpler Language', description: 'Make it easier to understand.' },
];

interface AiRefineActionProps {
  onRefine: (style: RefineStyle) => void;
  disabled: boolean;
  refiningStyle: RefineStyle | null;
}

const AiRefineAction: React.FC<AiRefineActionProps> = ({ onRefine, disabled, refiningStyle }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Close the menu if the button becomes disabled (e.g., user deselects text)
        if (disabled) {
            setIsOpen(false);
        }
    }, [disabled]);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className="w-full text-left p-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-between items-center hover:bg-slate-50"
                aria-expanded={isOpen}
                aria-controls="refine-options"
            >
                <div>
                    <div className="flex items-center gap-3">
                        <SparkleIcon className="text-blue-500 w-5 h-5"/>
                        <h3 className="text-md font-semibold text-slate-800">Refine Text</h3>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">Improve clarity, tone, or conciseness of selected text.</p>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div id="refine-options" className="p-2 pt-0">
                    <div className="border-t border-slate-200 my-2"></div>
                    <div className="space-y-1">
                        {refineStyles.map(style => (
                            <button
                                key={style.id}
                                onClick={() => {
                                    onRefine(style.id);
                                    setIsOpen(false);
                                }}
                                disabled={!!refiningStyle}
                                className="w-full text-left p-3 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-between disabled:cursor-not-allowed disabled:bg-slate-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 text-blue-500 flex items-center justify-center">
                                        {refiningStyle === style.id && <SpinnerIcon className="animate-spin" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-700">{style.label}</p>
                                        <p className="text-xs text-slate-500">{style.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Editor;
