import React from 'react';
import { Document } from '../types';
import { FileTextIcon } from './icons';

interface DashboardProps {
  documents: Document[];
  onCreateNew: () => void;
  onSelectDocument: (document: Document) => void;
  onDelete: (id: string) => void;
}

const statusStyles: Record<Document['status'], string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    in_review: 'bg-blue-100 text-blue-800',
    final: 'bg-green-100 text-green-800',
    archived: 'bg-slate-100 text-slate-600',
};


const Dashboard: React.FC<DashboardProps> = ({ documents, onCreateNew, onSelectDocument, onDelete }) => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">My Documents</h1>
        <button
          onClick={onCreateNew}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
        >
          Create New Document
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Updated</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => onSelectDocument(doc)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileTextIcon className="h-5 w-5 text-slate-400 mr-3" />
                    <div className="text-sm font-medium text-slate-900">{doc.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[doc.status]}`}>
                    {doc.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{doc.updatedAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            onDelete(doc.id);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label={`Delete document ${doc.title}`}
                    >
                        Delete
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;