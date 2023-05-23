export interface OsduSchemaIdentity {
  authority: string;
  entityType: string;
  id: string;
  schemaVersionMajor: number;
  schemaVersionMinor: number;
  schemaVersionPatch: number;
  source: string;
}

export interface OsduKind {
  createdBy: string;
  dateCreated: string;
  schemaIdentity: OsduSchemaIdentity;
  scope: string;
  status: string;
}
