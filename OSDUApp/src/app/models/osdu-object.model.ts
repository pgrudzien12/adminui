import { Acl } from './acl.model';
import { LegalTags } from './legal-tags.model';

export interface OsduObject {
  acl: Acl;
  authority: string;
  createTime: string;
  createUser: string;
  data: any;
  id: string;
  kind: string;
  legal: LegalTags;
  namespace: string;
  source: string;
  tags: any;
  type: string;
}
