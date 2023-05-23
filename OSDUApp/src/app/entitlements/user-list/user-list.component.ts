import {
  Component,
  OnChanges,
  Input,
  ViewChild,
  TemplateRef,
  ContentChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OsduMember } from 'src/app/models/osdu-member.model';
import { Helper } from 'src/app/common/helper.service';
import { Router } from '@angular/router';
import { AzureUser } from 'src/app/models/azure-user';
import { GraphApiService } from 'src/app/common/graph-api.service';
import { OsduGroup } from 'src/app/models/osdu-group.model';

type USERLIST_COLUMNS =
  | 'actions'
  | 'type'
  | 'displayName'
  | 'mail'
  | 'id'
  | 'role';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnChanges {
  @Input() osduMembers: OsduMember[];
  @Input() editRole = false;
  @Input() group: OsduGroup;
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  azureUsers: AzureUser[] = [];

  @ViewChild('paginator') paginator: MatPaginator;

  @Input() displayedColumns: USERLIST_COLUMNS[] = [
    'actions',
    'type',
    'displayName',
    'mail',
    'id',
    'role',
  ];

  dataSource = new MatTableDataSource();

  constructor(private router: Router, private graphApi: GraphApiService) {}

  ngOnChanges(): void {
    if (!this.osduMembers) return;

    this.dataSource = new MatTableDataSource(this.osduMembers);
    this.dataSource.paginator = this.paginator;
    this.provideAzureUser();
  }

  isGroup(element: OsduMember) {
    return Helper.isGroup(element);
  }

  provideAzureUser() {
    this.azureUsers = [];
    if (!this.dataSource.paginator) return;

    const data = this.dataSource.data.slice(
      this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize,
      (this.dataSource.paginator.pageIndex + 1) *
        this.dataSource.paginator.pageSize
    );

    data.forEach((member: OsduMember, index) => {
      if (Helper.isGroup(member)) return;
      this.graphApi.getUsersAndAppsById(member.email).subscribe((user) => {
        this.azureUsers[index] = user;
      });
    });
  }

  navigateToGroup(element: OsduMember) {
    this.router.navigate(['entitlement', 'manage-usersgroup'], {
      queryParams: {
        email: element.email,
      },
    });
  }
}
