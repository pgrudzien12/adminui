export interface AzureUser {
  displayName: string;
  mail: string;
  id: string;
  type: 'user' | 'application';
}
