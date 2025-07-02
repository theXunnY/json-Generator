import { SchemaTemplate, SchemaField } from '../types/schema';

const TEMPLATES_KEY = 'json-schema-templates';

const getDefaultTemplates = (): SchemaTemplate[] => [
  {
    id: 'default-user-profile',
    name: 'User Profile',
    createdAt: new Date().toISOString(),
    schema: [
      { id: 1, name: 'id', type: 'number', isPrimaryKey: true },
      { id: 2, name: 'name', type: 'string' },
      { id: 3, name: 'email', type: 'string' },
      { id: 4, name: 'age', type: 'number' },
      { id: 5, name: 'isActive', type: 'boolean' },
      { id: 6, name: 'createdAt', type: 'date' },
    ],
  },
  {
    id: 'default-product',
    name: 'Product',
    createdAt: new Date().toISOString(),
    schema: [
      { id: 1, name: 'id', type: 'number', isPrimaryKey: true },
      { id: 2, name: 'product', type: 'string' },
      { id: 3, name: 'description', type: 'string' },
      { id: 4, name: 'price', type: 'number' },
      { id: 5, name: 'inStock', type: 'boolean' },
      { id: 6, name: 'tags', type: 'array', arrayItemType: 'string' },
      { id: 7, name: 'createdAt', type: 'date' },
    ],
  },
  {
    id: 'default-blog-post',
    name: 'Blog Post',
    createdAt: new Date().toISOString(),
    schema: [
      { id: 1, name: 'id', type: 'number', isPrimaryKey: true },
      { id: 2, name: 'title', type: 'string' },
      { id: 3, name: 'author', type: 'object', children: [
        { id: 31, name: 'name', type: 'string' },
        { id: 32, name: 'email', type: 'string' },
      ] },
      { id: 4, name: 'content', type: 'string' },
      { id: 5, name: 'tags', type: 'array', arrayItemType: 'string' },
      { id: 6, name: 'published', type: 'boolean' },
      { id: 7, name: 'publishedAt', type: 'date' },
    ],
  },
  {
    id: 'default-order',
    name: 'Order',
    createdAt: new Date().toISOString(),
    schema: [
      { id: 1, name: 'orderId', type: 'number', isPrimaryKey: true },
      { id: 2, name: 'userId', type: 'number' },
      { id: 3, name: 'items', type: 'array', arrayItemType: 'object', arrayItemSchema: [
        { id: 31, name: 'productId', type: 'number' },
        { id: 32, name: 'quantity', type: 'number' },
        { id: 33, name: 'price', type: 'number' },
      ] },
      { id: 4, name: 'total', type: 'number' },
      { id: 5, name: 'status', type: 'string' },
      { id: 6, name: 'orderedAt', type: 'date' },
    ],
  },
  {
    id: 'default-employee',
    name: 'Employee Record',
    createdAt: new Date().toISOString(),
    schema: [
      { id: 1, name: 'employeeId', type: 'number', isPrimaryKey: true },
      { id: 2, name: 'name', type: 'string' },
      { id: 3, name: 'department', type: 'string' },
      { id: 4, name: 'email', type: 'string' },
      { id: 5, name: 'hireDate', type: 'date' },
      { id: 6, name: 'salary', type: 'number' },
      { id: 7, name: 'isActive', type: 'boolean' },
    ],
  },
];

export const saveTemplate = (name: string, schema: SchemaField[]): void => {
  const templates = getTemplates();
  const newTemplate: SchemaTemplate = {
    id: Date.now().toString(),
    name,
    schema,
    createdAt: new Date().toISOString()
  };
  
  templates.push(newTemplate);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
};

export const getTemplates = (): SchemaTemplate[] => {
  const stored = localStorage.getItem(TEMPLATES_KEY);
  const userTemplates = stored ? JSON.parse(stored) : [];
  const defaults = getDefaultTemplates();
  // Only add defaults if no user templates exist
  if (userTemplates.length === 0) return defaults;
  // Merge, but don't duplicate by id
  const merged = [...userTemplates];
  defaults.forEach(def => {
    if (!merged.some(t => t.id === def.id)) merged.push(def);
  });
  return merged;
};

export const deleteTemplate = (id: string): void => {
  const templates = getTemplates().filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
};

export const loadTemplate = (id: string): SchemaField[] | null => {
  const templates = getTemplates();
  const template = templates.find(t => t.id === id);
  return template ? template.schema : null;
};