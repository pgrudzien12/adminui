export interface SchemaProperty {
  description: string;
  example: string;
  pattern: string;
  title: string;
  type: string;
  format?: string;
  allOf?: Array<any>;
  $ref?: string;
  items?: any;
  properties?: any;
  oneOf?: Array<any>;
  'x-osdu-relationship'?: Array<{
    EntityType: string;
    GroupType: string;
  }>;
}
