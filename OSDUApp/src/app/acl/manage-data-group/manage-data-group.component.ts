import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OsduGroup } from 'src/app/models/osdu-group.model';
import { OsduObject } from 'src/app/models/osdu-object.model';

@Component({
  selector: 'app-manage-data-group',
  templateUrl: './manage-data-group.component.html',
})
export class ManageDataGroupComponent implements AfterViewInit {
  sub: Subscription;

  selectedGroup: OsduGroup;

  templateColumns = [];

  baseQuery = null;

  boundCanDelete = this.canDelete.bind(this);

  @ViewChild('aclColumnRef') aclColumnRef: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.sub = this.route.queryParams.subscribe((params) => {
      if (!params.email) {
        this.selectedGroup = null;
        this.baseQuery = null;
        return;
      }
      if (this.selectedGroup?.email !== params.email) {
        this.baseQuery = null;
        this.changeDetectorRef.detectChanges();
      }
      this.selectedGroup = {
        email: params.email as string,
        name: '',
        description: '',
      };

      this.baseQuery = {
        kind: '*:*:*:*',
        query: `acl.viewers:${this.selectedGroup.email} OR acl.owners:${this.selectedGroup.email}`,
      };
    });

    this.templateColumns = [
      {
        name: 'ACL membership',
        id: 'aclMembership',
        templateRef: this.aclColumnRef,
      },
    ];
  }

  selectedChange(event: OsduGroup) {
    this.router.navigate(['acl', 'manage-data-groups'], {
      queryParams: {
        email: event?.email,
      },
    });
  }

  onDelete() {
    const group = this.selectedGroup;
    this.selectedGroup = null;
    this.selectedChange(group);
  }

  canDelete(object: OsduObject) {
    return (
      object.acl.viewers.length > 1 &&
      !!object.acl.viewers.find(
        (el) => el.toLowerCase() === this.selectedGroup.email.toLowerCase()
      )
    );
  }

  getACLMemberships(object: OsduObject) {
    const resArray = [];

    if (object.acl.viewers.includes(this.selectedGroup.email))
      resArray.push('Viewer');

    if (object.acl.owners.includes(this.selectedGroup.email))
      resArray.push('Owner');

    return resArray.join(',');
  }

  getACLsLink(element: OsduObject) {
    return ['/object-view', element.id, 'acl'];
  }
}
