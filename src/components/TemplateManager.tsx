import React, { useState, useEffect } from 'react';
import { Save, Folder, Trash2, Plus } from 'lucide-react';
import { SchemaField, SchemaTemplate } from '../types/schema';
import { saveTemplate, getTemplates, deleteTemplate, loadTemplate } from '../utils/localStorage';

interface TemplateManagerProps {
  currentSchema: SchemaField[];
  onLoadSchema: (schema: SchemaField[]) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ 
  currentSchema, 
  onLoadSchema 
}) => {
  const [templates, setTemplates] = useState<SchemaTemplate[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  const handleSaveTemplate = () => {
    if (!templateName.trim() || currentSchema.length === 0) return;
    
    saveTemplate(templateName.trim(), currentSchema);
    setTemplates(getTemplates());
    setTemplateName('');
    setShowSaveDialog(false);
  };

  const handleLoadTemplate = (id: string) => {
    const schema = loadTemplate(id);
    if (schema) {
      onLoadSchema(schema);
      setShowTemplates(false);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplate(id);
    setTemplates(getTemplates());
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setShowSaveDialog(true)}
          disabled={currentSchema.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save size={16} />
          Save Template
        </button>
        
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <Folder size={16} />
          Templates ({templates.length})
        </button>
      </div>

      {showSaveDialog && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Save Schema Template</h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-600 placeholder-gray-400 dark:placeholder-gray-500 transition-colors hover:bg-gray-700 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTemplate()}
            />
            <button
              onClick={handleSaveTemplate}
              disabled={!templateName.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false);
                setTemplateName('');
              }}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showTemplates && (
        <div className="bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-400 dark:border-gray-700">
            <h4 className="font-medium text-gray-800 dark:text-gray-100">Saved Templates</h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {templates.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p>No saved templates</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 dark:text-gray-100">{template.name}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {template.schema.length} field{template.schema.length !== 1 ? 's' : ''} • 
                        {' '}
                        {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoadTemplate(template.id)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md transition-colors"
                        title="Load template"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors"
                        title="Delete template"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;