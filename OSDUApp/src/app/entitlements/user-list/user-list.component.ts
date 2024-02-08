import {
  Component,
  OnChanges,
  Input,
  Output,
  ViewChild,
  TemplateRef,
  ContentChild,
  SimpleChanges,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { OsduMember, OsduUser } from 'src/app/models/osdu-member.model';
import { Helper } from 'src/app/common/helper.service';
import { Router } from '@angular/router';
import { GraphApiService } from 'src/app/common/graph-api.service';
import { OsduGroup } from 'src/app/models/osdu-group.model';
import { SelectionModel } from '@angular/cdk/collections';
import { map, defaultIfEmpty } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';

type USERLIST_COLUMNS =
  | 'select'
  | 'actions'
  | 'type'
  | 'displayName'
  | 'mail'
  | 'id'
  | 'role';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnChanges, OnDestroy {
  @Input() osduMembers: OsduMember[];
  @Input() editRole = false;
  @Input() group: OsduGroup;
  @Input() filterGroup = false;
  @Input() filterApp = false;
  @Input() fiterUnknown = false;
  @Input() filterUsers = false;
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  osduUsers: OsduUser[] = [];
  subscription: Subscription = new Subscription();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() displayedColumns: USERLIST_COLUMNS[] = [
    'select',
    'actions',
    'type',
    'displayName',
    'mail',
    'id',
    'role',
  ];

  @Output() selectionChanged = new EventEmitter<OsduUser[]>();

  arrayObs = [];
  dataSource = new MatTableDataSource<OsduUser>();
  filteredData = new MatTableDataSource<OsduUser>();
  selection = new SelectionModel<OsduUser>(true, []);

  constructor(private router: Router, private graphApi: GraphApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.osduMembers) return;

    if (
      changes.osduMembers &&
      (changes.osduMembers.previousValue === undefined ||
        changes.osduMembers.previousValue !== changes.osduMembers.currentValue)
    ) {
      this.filteredData.data = [];
      this.createDataSource();
      this.subscription.add(
        forkJoin(this.arrayObs)
          .pipe(defaultIfEmpty([]))
          .subscribe((x: OsduUser[]) => {
            this.osduUsers = this.osduUsers.concat(x);
            this.osduUsers = this.osduUsers.filter(
              (obj, index, self) =>
                index ===
                self.findIndex(
                  (o) => JSON.stringify(o) === JSON.stringify(obj) // Deep comparison
                )
            );
            this.filteredData.data = this.osduUsers;
            this.dataSource.data = this.osduUsers;
            this.filteredData.paginator = this.paginator;
            this.selection.clear();
            this.emitSelection();
          })
      );
    }

    if (
      (this.filterGroup &&
        this.filterApp &&
        this.fiterUnknown &&
        this.filterUsers) ||
      (!this.filterGroup &&
        !this.filterApp &&
        !this.fiterUnknown &&
        !this.filterUsers)
    ) {
      this.filteredData.data = this.dataSource.data;
    } else {
      let filteredData;
      filteredData = this.dataSource.data.filter((member: OsduUser) => {
        return (
          (this.filterGroup && member.isGroup) ||
          (this.filterApp &&
            !member.isGroup &&
            member.azureMember.type === 'application') ||
          (this.fiterUnknown &&
            !member.isGroup &&
            member.azureMember.id === 'unknown') ||
          (this.filterUsers &&
            !member.isGroup &&
            member.azureMember.id !== 'unknown' &&
            member.azureMember.type === 'user')
        );
      });
      this.filteredData.data = filteredData;
      this.paginator.length = this.filteredData.data.length;
      this.filteredData.paginator = this.paginator;
    }

    this.sort.sortChange.subscribe((sort: Sort) => {
      const sortByNestedProperty =
        (
          property: string,
          property2: string,
          nestedProperty: string,
          nestedProperty2: string,
          direction: string
        ) =>
        (a, b) => {
          const nestedA =
            a[property]?.[nestedProperty] ||
            a[property2]?.[nestedProperty2] ||
            '';
          const nestedB =
            b[property]?.[nestedProperty] ||
            b[property2]?.[nestedProperty2] ||
            '';
          if (direction === 'desc') {
            return nestedA.localeCompare(nestedB);
          } else {
            return nestedB.localeCompare(nestedA);
          }
        };
      let sortedData = this.filteredData.data;

      if (sort.active === 'displayName') {
        sortedData.sort(
          sortByNestedProperty(
            'azureMember',
            'member',
            'displayName',
            'email',
            sort.direction
          )
        );
      } else if (sort.active === 'type') {
        sortedData.sort(
          sortByNestedProperty(
            'azureMember',
            'member',
            'type',
            'email',
            sort.direction
          )
        );
      } else if (sort.active === 'mail') {
        sortedData.sort(
          sortByNestedProperty(
            'azureMember',
            'member',
            'mail',
            'email',
            sort.direction
          )
        );
      } else if (sort.active === 'id') {
        sortedData.sort(
          sortByNestedProperty(
            'member',
            'member',
            'email',
            'email',
            sort.direction
          )
        );
      } else if (sort.active === 'role') {
        sortedData.sort(
          sortByNestedProperty(
            'member',
            'member',
            'role',
            'role',
            sort.direction
          )
        );
      }
      this.filteredData.data = sortedData;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  createDataSource() {
    this.osduUsers = [];
    this.arrayObs = [];
    const data = this.osduMembers;

    data.forEach((member: OsduMember) => {
      if (Helper.isGroup(member)) {
        let osduUser: OsduUser = {
          member: member,
          group: null,
          azureMember: null,
          isGroup: true,
        };
        this.osduUsers.push(osduUser);
        // this.arrayObs.push(osduUser);
      } else {
        this.arrayObs.push(
          this.graphApi.getUsersAndAppsById(member.email).pipe(
            map((user) => {
              let osduUser: OsduUser = {
                member: member,
                group: null,
                azureMember: user,
                isGroup: false,
              };
              return osduUser;
            })
          )
        );
      }
    });
    forkJoin(this.arrayObs);
  }

  navigateToGroup(element: OsduMember) {
    this.router.navigate(['entitlement', 'manage-usersgroup'], {
      queryParams: {
        email: element.email,
      },
    });
  }

  onMasterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear(); // Deselect all items
    } else {
      this.dataSource.data.forEach((row: OsduUser) => {
        this.selection.select(row);
      });
    }
    this.emitSelection();
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numRows > 0 && numSelected === numRows;
  }

  isSomeSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  // Method to handle checkbox change for an individual row
  onCheckboxChange(row: OsduUser): void {
    this.selection.toggle(row);
    this.emitSelection();
  }

  private emitSelection(): void {
    this.selectionChanged.emit(this.selection.selected);
  }
}
