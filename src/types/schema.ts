export type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';

export interface SchemaField {
  id: string | number;
  name: string;
  type: FieldType;
  children?: SchemaField[];
  arrayItemType?: FieldType;
  arrayItemSchema?: SchemaField[];
  defaultValue?: any;
  required?: boolean;
  isPrimaryKey?: boolean;
  dateMin?: string; // ISO date string
  dateMax?: string; // ISO date string
}

export interface JsonSchema {
  [key: string]: any;
}

export interface SchemaTemplate {
  id: string;
  name: string;
  schema: SchemaField[];
  createdAt: string;
}

export interface GenerationConfig {
  count: number;
  schema: SchemaField[];
}