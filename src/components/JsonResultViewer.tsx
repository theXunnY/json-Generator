import React from 'react';
import { Copy, CheckCircle, Download } from 'lucide-react';
import { JsonSchema } from '../types/schema';

interface JsonResultViewerProps {
  result: JsonSchema | JsonSchema[] | null;
  loading: boolean;
}

const JsonResultViewer: React.FC<JsonResultViewerProps> = ({ result, loading }) => {
  const [copied, setCopied] = React.useState(false);
  
  const resultString = result ? JSON.stringify(result, null, 2) : '';
  const isArray = Array.isArray(result);
  const count = isArray ? result.length : (result ? 1 : 0);

  const copyToClipboard = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(resultString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadJson = () => {
    if (!result) return;
    
    const blob = new Blob([resultString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-data-${count}-records.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Generated JSON</h3>
          {result && (
            <p className="text-sm text-gray-500 mt-1">
              {count} record{count !== 1 ? 's' : ''} generated
            </p>
          )}
        </div>
        {result && (
          <div className="flex gap-2">
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
            <button
              onClick={downloadJson}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-md transition-colors"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Generating data...</span>
          </div>
        ) : result ? (
          <pre className="bg-gray-50 rounded-md p-4 text-sm overflow-x-auto border max-h-96 overflow-y-auto">
            <code className="text-gray-800">{resultString}</code>
          </pre>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Click "Generate JSON" to see the generated data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonResultViewer;