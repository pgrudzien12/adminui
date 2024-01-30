import { AzureUser } from './azure-user';
import { OsduGroup } from './osdu-group.model';

export interface OsduUser {
  group: OsduGroup;
  member: OsduMember;
  azureMember: AzureUser;
  isGroup: boolean;
}

export interface OsduUser {
  group: OsduGroup;
  member: OsduMember;
  azureMember: AzureUser;
  isGroup: boolean;
}
export interface OsduMember {
  email: string;
  role: string;
}

export interface OsduMemberWithAzureUser extends OsduMember {
  azureUser?: AzureUser;
}

export interface OsduMemberWithAzureAndGroups extends OsduMember {
  displayName: string | null;
  mail: string | null;
  id: string | null;
  type: 'user' | 'application' | 'group';
}
