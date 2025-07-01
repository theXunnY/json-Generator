import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Key } from 'lucide-react';
import { SchemaField, FieldType } from '../types/schema';

interface FieldBuilderProps {
  fields: SchemaField[];
  onFieldsChange: (fields: SchemaField[]) => void;
  depth?: number;
  parentFields?: SchemaField[]; // To check for primary keys in parent scope
}

const FieldBuilder: React.FC<FieldBuilderProps> = ({ 
  fields, 
  onFieldsChange, 
  depth = 0,
  parentFields = []
}) => {
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Check if there's already a primary key in the entire schema
  const checkForPrimaryKeyInSchema = (fieldsToCheck: SchemaField[]): boolean => {
    for (const field of fieldsToCheck) {
      if (field.isPrimaryKey) return true;
      if (field.children && checkForPrimaryKeyInSchema(field.children)) return true;
      if (field.arrayItemSchema && checkForPrimaryKeyInSchema(field.arrayItemSchema)) return true;
    }
    return false;
  };

  // Get all root fields to check for primary key
  const getAllRootFields = (): SchemaField[] => {
    if (depth === 0) return fields;
    return parentFields;
  };

  const hasPrimaryKeyInSchema = checkForPrimaryKeyInSchema(getAllRootFields());

  const addField = () => {
    const newField: SchemaField = {
      id: generateId(),
      name: '',
      type: 'string',
      required: true,
      isPrimaryKey: false
    };
    onFieldsChange([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<SchemaField>) => {
    const updatedFields = fields.map(field => {
      if (field.id === id) {
        const updatedField = { ...field, ...updates };
        return updatedField;
      }
      return field;
    });
    onFieldsChange(updatedFields);
  };

  const deleteField = (id: string) => {
    const updatedFields = fields.filter(field => field.id !== id);
    onFieldsChange(updatedFields);
  };

  const toggleExpanded = (fieldId: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldId)) {
      newExpanded.delete(fieldId);
    } else {
      newExpanded.add(fieldId);
    }
    setExpandedFields(newExpanded);
  };

  const updateNestedFields = (fieldId: string, nestedFields: SchemaField[]) => {
    updateField(fieldId, { children: nestedFields });
  };

  const updateArrayItemSchema = (fieldId: string, arrayItemSchema: SchemaField[]) => {
    updateField(fieldId, { arrayItemSchema });
  };

  const indentClass = depth > 0 ? `ml-${Math.min(depth * 4, 16)}` : '';

  return (
    <div className={`space-y-4 ${indentClass}`}>
      {fields.map((field) => {
        // Check if this specific field can show primary key option
        const canShowPrimaryKey = (field.type === 'string' || field.type === 'number') && 
                                 (!hasPrimaryKeyInSchema || field.isPrimaryKey) &&
                                 depth === 0; // Only allow primary keys at root level

        return (
          <div key={String(field.id)} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {(field.type === 'object' || field.type === 'array') && (
                  <button
                    onClick={() => toggleExpanded(String(field.id))}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {expandedFields.has(String(field.id)) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                )}
                
                <input
                  type="text"
                  placeholder="Field name"
                  value={field.name}
                  onChange={(e) => updateField(String(field.id), { name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                />
                
                <select
                  value={field.type}
                  onChange={(e) => updateField(String(field.id), { 
                    type: e.target.value as FieldType,
                    children: e.target.value === 'object' ? [] : undefined,
                    arrayItemType: e.target.value === 'array' ? 'string' : undefined,
                    arrayItemSchema: undefined,
                    isPrimaryKey: (e.target.value === 'object' || e.target.value === 'array') ? false : field.isPrimaryKey
                  })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="object">Object</option>
                  <option value="array">Array</option>
                  <option value="date">Date</option>
                </select>
                
                <button
                  onClick={() => deleteField(String(field.id))}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {field.type === 'array' && (
                <div className="mb-3 pl-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Array Item Type:
                  </label>
                  <select
                    value={field.arrayItemType || 'string'}
                    onChange={(e) => updateField(String(field.id), { 
                      arrayItemType: e.target.value as FieldType,
                      arrayItemSchema: e.target.value === 'object' ? [] : undefined
                    })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="object">Object</option>
                    <option value="date">Date</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`required-${String(field.id)}`}
                    checked={field.required || false}
                    onChange={(e) => updateField(String(field.id), { required: e.target.checked })}
                    className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                  />
                  <label htmlFor={`required-${String(field.id)}`} className="text-sm text-gray-600 dark:text-gray-300">
                    Required field
                  </label>
                </div>

                {canShowPrimaryKey && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`primary-${String(field.id)}`}
                      checked={field.isPrimaryKey || false}
                      onChange={(e) => updateField(String(field.id), { isPrimaryKey: e.target.checked })}
                      className="rounded border-gray-300 dark:border-gray-700 text-amber-600 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                    />
                    <label htmlFor={`primary-${String(field.id)}`} className="text-sm text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <Key size={14} />
                      Primary Key
                    </label>
                  </div>
                )}
              </div>

              {field.isPrimaryKey && (
                <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded-md">
                  <p className="text-xs text-amber-700 dark:text-amber-200">
                    <Key size={12} className="inline mr-1" />
                    This field will generate unique identifiers for each record
                  </p>
                </div>
              )}

              {field.type === 'date' && (
                <div className="mb-3 flex gap-4 items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Range:</label>
                  <input
                    type="date"
                    value={field.dateMin || ''}
                    onChange={(e) => updateField(String(field.id), { dateMin: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                  />
                  <span className="text-gray-700 dark:text-gray-300">to</span>
                  <input
                    type="date"
                    value={field.dateMax || ''}
                    onChange={(e) => updateField(String(field.id), { dateMax: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
                  />
                </div>
              )}
            </div>

            {expandedFields.has(String(field.id)) && field.type === 'object' && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">Object Properties</h4>
                  <button
                    onClick={() => {
                      const newNestedField: SchemaField = {
                        id: generateId(),
                        name: '',
                        type: 'string',
                        required: true,
                        isPrimaryKey: false
                      };
                      updateNestedFields(String(field.id), [...(field.children || []), newNestedField]);
                    }}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={14} />
                    Add Property
                  </button>
                </div>
                <FieldBuilder
                  fields={field.children || []}
                  onFieldsChange={(nestedFields) => updateNestedFields(String(field.id), nestedFields)}
                  depth={depth + 1}
                  parentFields={getAllRootFields()}
                />
              </div>
            )}

            {expandedFields.has(String(field.id)) && field.type === 'array' && field.arrayItemType === 'object' && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">Array Item Schema</h4>
                  <button
                    onClick={() => {
                      const newNestedField: SchemaField = {
                        id: generateId(),
                        name: '',
                        type: 'string',
                        required: true,
                        isPrimaryKey: false
                      };
                      updateArrayItemSchema(String(field.id), [...(field.arrayItemSchema || []), newNestedField]);
                    }}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={14} />
                    Add Property
                  </button>
                </div>
                <FieldBuilder
                  fields={field.arrayItemSchema || []}
                  onFieldsChange={(nestedFields) => updateArrayItemSchema(String(field.id), nestedFields)}
                  depth={depth + 1}
                  parentFields={getAllRootFields()}
                />
              </div>
            )}
          </div>
        );
      })}
      
      {depth === 0 && (
        <button
          onClick={addField}
          className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600"
        >
          <Plus size={20} />
          Add Field
        </button>
      )}
    </div>
  );
};

export default FieldBuilder;