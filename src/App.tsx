import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Database, Hash } from 'lucide-react';
import FieldBuilder from './components/FieldBuilder';
import SchemaPreview from './components/SchemaPreview';
import JsonResultViewer from './components/JsonResultViewer';
import TemplateManager from './components/TemplateManager';
import { SchemaField, JsonSchema } from './types/schema';
import { MockDataGenerator } from './utils/schemaGenerator';

function App() {
  const [fields, setFields] = useState<SchemaField[]>([]);
  const [generatedJson, setGeneratedJson] = useState<JsonSchema | JsonSchema[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recordCount, setRecordCount] = useState<number>(1);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const generateJson = async () => {
    if (fields.length === 0) return;
    
    setIsGenerating(true);
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      let result;
      if (recordCount === 1) {
        result = MockDataGenerator.generateFromSchema(fields);
      } else {
        result = MockDataGenerator.generateMultipleFromSchema(fields, recordCount);
      }
      setGeneratedJson(result);
    } catch (error) {
      console.error('Error generating JSON:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetSchema = () => {
    setFields([]);
    setGeneratedJson(null);
  };

  const hasValidFields = fields.length > 0 && fields.every(field => field.name.trim() !== '');
  const hasPrimaryKey = fields.some(field => field.isPrimaryKey);

  function ensureRequired(fields: SchemaField[]): SchemaField[] {
    return fields.map((field: SchemaField) => {
      const updated: SchemaField = { ...field, required: field.required !== undefined ? field.required : true };
      if (updated.children) {
        updated.children = ensureRequired(updated.children);
      }
      if (updated.arrayItemSchema) {
        updated.arrayItemSchema = ensureRequired(updated.arrayItemSchema);
      }
      return updated;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Dark mode toggle in top right */}
      <button
        onClick={() => setDarkMode(dm => !dm)}
        className="fixed top-4 right-4 z-50 px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-lg transition-colors"
        title="Toggle dark mode"
      >
        {darkMode ? '🌙' : '☀️'}
      </button>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">JSON Schema Builder</h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Build JSON schemas visually and generate mock data instantly. 
            Create complex nested structures with arrays, objects, and primary keys.
          </p>
        </div>

        {/* Generation Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm">
            <Hash size={20} className="text-gray-500" />
            <label htmlFor="recordCount" className="text-sm font-medium text-gray-700">
              Records to generate:
            </label>
            <input
              id="recordCount"
              type="number"
              min="1"
              max="100"
              value={recordCount}
              onChange={(e) => setRecordCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
            />
          </div>

          <button
            onClick={generateJson}
            disabled={!hasValidFields || isGenerating}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Play size={20} />
            {isGenerating ? 'Generating...' : `Generate ${recordCount > 1 ? `${recordCount} Records` : 'JSON'}`}
          </button>
          
          <button
            onClick={resetSchema}
            disabled={fields.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <RotateCcw size={20} />
            Reset Schema
          </button>
        </div>

        {/* Primary Key Status */}
        {hasValidFields && (
          <div className="flex justify-center mb-6">
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
              hasPrimaryKey 
                ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                : 'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>
              {hasPrimaryKey ? (
                <>✓ Primary key configured - records will have unique identifiers</>
              ) : (
                <>⚠ No primary key set - consider adding one for unique record identification</>
              )}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Schema Builder */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Schema Builder</h2>
                <p className="text-gray-600 mt-1">Define your JSON structure by adding fields</p>
              </div>
              <div className="p-6">
                <FieldBuilder fields={fields} onFieldsChange={setFields} />
              </div>
            </div>

            {/* Template Manager */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Manager</h3>
              <TemplateManager 
                currentSchema={fields} 
                onLoadSchema={(schema) => {
                  const withRequired = ensureRequired(schema);
                  console.log('Loaded template schema:', withRequired);
                  setFields(withRequired);
                }} 
              />
            </div>
          </div>

          {/* Right Column - Preview and Results */}
          <div className="space-y-6">
            <SchemaPreview fields={fields} />
            <JsonResultViewer result={generatedJson} loading={isGenerating} />
            {/* API Coming Soon Card */}
            <div className="rounded-lg border-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950 shadow-lg p-6 flex flex-col items-center justify-center">
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">API coming soon</h3>
              <p className="text-blue-800 dark:text-blue-200 text-center">You will be able to access your generated JSON via our API.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
           Made with ❤️ by <a href="https://github.com/theXunnY" className="text-blue-600 hover:underline">TheXunnY</a>
            </p>
        </div>
      </div>
    </div>
  );
}

export default App;