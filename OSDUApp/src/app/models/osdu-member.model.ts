import { AzureUser } from './azure-user';

export interface OsduMember {
  email: string;
  role: string;
}

export interface OsduMemberWithAzureUser extends OsduMember {
  azureUser?: AzureUser;
}
