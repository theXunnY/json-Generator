import React from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import { SchemaField } from '../types/schema';
import { convertSchemaFieldsToJsonSchema } from '../utils/schemaGenerator';

interface SchemaPreviewProps {
  fields: SchemaField[];
}

const SchemaPreview: React.FC<SchemaPreviewProps> = ({ fields }) => {
  const [copied, setCopied] = React.useState(false);
  
  const schema = convertSchemaFieldsToJsonSchema(fields);
  const schemaString = JSON.stringify(schema, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(schemaString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (fields.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schema Preview</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Add fields to see the schema preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Schema Preview</h3>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle size={16} className="text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="p-4">
        <pre className="bg-gray-50 rounded-md p-4 text-sm overflow-x-auto border">
          <code className="text-gray-800">{schemaString}</code>
        </pre>
      </div>
    </div>
  );
};

export default SchemaPreview;