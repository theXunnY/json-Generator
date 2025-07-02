import { SchemaField, JsonSchema } from '../types/schema';

const SAMPLE_NAMES = [
  'Aarav Sharma', 'Diya Patel', 'Rohan Mehta', 'Ananya Iyer', 'Karan Nair',
  'Sneha Reddy', 'Vikram Kapoor', 'Ishita Joshi', 'Raj Malhotra', 'Pooja Desai',
  'Aditya Rao', 'Nikita Singh', 'Arjun Verma', 'Priya Agarwal', 'Manav Bhatt',
  'Neha Choudhary', 'Siddharth Bansal', 'Kritika Menon', 'Rahul Sinha', 'Riya Das',
  'Ayaan Trivedi', 'Tanvi Shetty', 'Devansh Ghosh', 'Meera Pillai', 'Yash Mahajan',
  'Saanvi Kulkarni', 'Akhil Saxena', 'Lavanya Dutta', 'Rudra Joshi', 'Shreya Pandey',
  'Ishan Kaur', 'Bhavna Rathi', 'Amitabh Chauhan', 'Kavya Sehgal', 'Mohit Dubey',
  'Nandini Batra', 'Krishna Vora', 'Anjali Jain', 'Tanishq Tyagi', 'Simran Kohli',
  'Paras Rawat', 'Mitali Banerjee', 'Varun Chatterjee', 'Aishwarya Gopal', 'Deepak Raina',
  'Payal Chopra', 'Harsh Venkatesh', 'Rachna Bhattacharya', 'Sagar Patil', 'Trisha Naik'
];


const SAMPLE_WORDS = [
  'innovation', 'development', 'technology', 'solution', 'project',
  'analysis', 'research', 'strategy', 'optimization', 'implementation',
  'framework', 'architecture', 'platform', 'integration', 'automation'
];

const SAMPLE_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad',
  'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow',
  'Kanpur', 'Nagpur', 'Indore', 'Bhopal', 'Patna',
  'Vadodara', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
  'Meerut', 'Rajkot', 'Varanasi', 'Srinagar', 'Amritsar',
  'Ranchi', 'Coimbatore', 'Vijayawada', 'Jodhpur', 'Raipur',
  'Guwahati', 'Chandigarh', 'Solapur', 'Hubli', 'Mysore',
  'Tiruchirappalli', 'Jalandhar', 'Bhubaneswar', 'Noida', 'Gwalior',
  'Thiruvananthapuram', 'Aurangabad', 'Salem', 'Warangal', 'Tirupati',
  'Udaipur', 'Dehradun', 'Allahabad', 'Aligarh', 'Jamshedpur'
];


const SAMPLE_STREETS= [
  'MG Road', 'Netaji Subhash Marg', 'Nehru Street', 'Jawahar Road', 'Gandhi Path',
  'Rajpath', 'Lal Bahadur Shastri Marg', 'Indira Nagar', 'Ashok Vihar', 'Sarojini Street',
  'Bapu Bazaar Road', 'Anna Salai', 'Kasturba Gandhi Road', 'Tilak Marg', 'Bhagat Singh Road',
  'Vivekananda Street', 'Ambedkar Chowk', 'Patel Nagar', 'Tagore Avenue', 'Rani Laxmi Bai Road',
  'Sardar Vallabhbhai Patel Marg', 'Krishna Nagar', 'Shivaji Path', 'Chandni Chowk', 'Hanuman Galli',
  'Dharampeth Extension', 'Malviya Road', 'Shastri Street', 'Subhash Chowk', 'Azad Nagar Lane',
  'Gokhale Marg', 'Rajendra Path', 'Deshbandhu Road', 'Nizamuddin Lane', 'Park Town Road',
  'Mira Bai Marg', 'Narayan Das Street', 'Ravindra Nagar', 'Lokmanya Tilak Road', 'Sai Baba Lane',
  'Basaveshwara Road', 'Tagore Marg', 'Raja Ram Mohan Roy Street', 'Kali Temple Lane', 'Mahatma Gandhi Road',
  'Bose Lane', 'Sarvapalli Radhakrishnan Street', 'Chhatrapati Shivaji Marg', 'Balaji Nagar Lane', 'Temple Street'
];


const SAMPLE_EMAILS = [
  'user@example.com', 'contact@company.com', 'info@business.org',
  'admin@service.net', 'support@platform.io'
];

export class MockDataGenerator {
  private static usedPrimaryKeys = new Set<string>();
  private static primaryKeyCounters = new Map<string, number>();

  private static resetPrimaryKeys(): void {
    this.usedPrimaryKeys.clear();
    this.primaryKeyCounters.clear();
  }

  private static getRandomString(type: string = 'word'): string {
    switch (type) {
      case 'name':
        return SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
      case 'city':
        return SAMPLE_CITIES[Math.floor(Math.random() * SAMPLE_CITIES.length)];
      case 'street':
        return SAMPLE_STREETS[Math.floor(Math.random() * SAMPLE_STREETS.length)];
      case 'email':
        return SAMPLE_EMAILS[Math.floor(Math.random() * SAMPLE_EMAILS.length)];
      default:
        return SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)];
    }
  }

  private static getRandomNumber(): number {
    return Math.floor(Math.random() * 1000) + 1;
  }

  private static getRandomBoolean(): boolean {
    return Math.random() > 0.5;
  }

  private static getRandomDate(min?: string, max?: string): string {
    const minDate = min ? new Date(min) : new Date('2000-01-01');
    const maxDate = max ? new Date(max) : new Date('2030-12-31');
    const minTime = minDate.getTime();
    const maxTime = maxDate.getTime();
    const randomTime = minTime + Math.random() * (maxTime - minTime);
    return new Date(randomTime).toISOString().split('T')[0];
  }

  private static generatePrimaryKey(field: SchemaField, index: number): any {
    const fieldName = field.name.toLowerCase();
    
    if (field.type === 'number') {
      // For numeric primary keys, use sequential IDs starting from 1
      return index + 1;
    } else if (field.type === 'string') {
      // For string primary keys, create unique identifiers
      if (fieldName.includes('id') || fieldName.includes('uuid')) {
        return `${field.name.toLowerCase()}_${(index + 1).toString().padStart(3, '0')}`;
      } else if (fieldName.includes('email')) {
        return `user${index + 1}@example.com`;
      } else if (fieldName.includes('username') || fieldName.includes('user')) {
        return `user${index + 1}`;
      } else {
        return `${field.name.toLowerCase()}_${index + 1}`;
      }
    }
    
    return index + 1;
  }

  private static inferStringType(fieldName: string): string {
    const name = fieldName.toLowerCase();
    if (name.includes('name') || name.includes('title') || name.includes('author')) {
      return 'name';
    }
    if (name.includes('email')) {
      return 'email';
    }
    if (name.includes('city')) {
      return 'city';
    }
    if (name.includes('street') || name.includes('address')) {
      return 'street';
    }
    return 'word';
  }

  public static generateMultipleFromSchema(fields: SchemaField[], count: number): JsonSchema[] {
    this.resetPrimaryKeys();
    const results: JsonSchema[] = [];

    for (let i = 0; i < count; i++) {
      const result = this.generateFromSchemaWithIndex(fields, i);
      results.push(result);
    }

    return results;
  }

  public static generateFromSchema(fields: SchemaField[]): JsonSchema {
    this.resetPrimaryKeys();
    return this.generateFromSchemaWithIndex(fields, 0);
  }

  private static generateFromSchemaWithIndex(fields: SchemaField[], index: number): JsonSchema {
    const result: JsonSchema = {};

    fields.forEach(field => {
      result[field.name] = this.generateFieldValueWithIndex(field, index);
    });

    return result;
  }

  private static generateFieldValueWithIndex(field: SchemaField, index: number): any {
    // Handle primary key generation
    if (field.isPrimaryKey) {
      return this.generatePrimaryKey(field, index);
    }

    switch (field.type) {
      case 'string':
        return this.getRandomString(this.inferStringType(field.name));
        
      case 'number':
        return this.getRandomNumber();
        
      case 'boolean':
        return this.getRandomBoolean();
        
      case 'object':
        if (field.children && field.children.length > 0) {
          return this.generateFromSchemaWithIndex(field.children, index);
        }
        return {};
        
      case 'array':
        const arrayLength = Math.floor(Math.random() * 3) + 1; // 1-3 items
        const array = [];
        
        for (let i = 0; i < arrayLength; i++) {
          if (field.arrayItemType === 'object' && field.arrayItemSchema) {
            array.push(this.generateFromSchemaWithIndex(field.arrayItemSchema, i));
          } else if (field.arrayItemType) {
            const mockField: SchemaField = {
              id: `temp-${i}`,
              name: `item${i}`,
              type: field.arrayItemType
            };
            array.push(this.generateFieldValueWithIndex(mockField, i));
          } else {
            array.push(this.getRandomString());
          }
        }
        return array;
        
      case 'date':
        return this.getRandomDate(field.dateMin, field.dateMax);
        
      default:
        return null;
    }
  }

  private static generateFieldValue(field: SchemaField): any {
    return this.generateFieldValueWithIndex(field, 0);
  }
}

export const convertSchemaFieldsToJsonSchema = (fields: SchemaField[]): JsonSchema => {
  const schema: JsonSchema = {};
  
  fields.forEach(field => {
    schema[field.name] = convertFieldToSchemaType(field);
  });
  
  return schema;
};

const convertFieldToSchemaType = (field: SchemaField): any => {
  switch (field.type) {
    case 'string':
    case 'number':
    case 'boolean':
      return field.type;
      
    case 'object':
      if (field.children && field.children.length > 0) {
        return convertSchemaFieldsToJsonSchema(field.children);
      }
      return {};
      
    case 'array':
      if (field.arrayItemType === 'object' && field.arrayItemSchema) {
        return [convertSchemaFieldsToJsonSchema(field.arrayItemSchema)];
      } else if (field.arrayItemType) {
        return [field.arrayItemType];
      }
      return ['string'];
      
    default:
      return field.type;
  }
};