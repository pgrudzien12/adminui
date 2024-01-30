import {
  Component,
  OnChanges,
  Input,
  ViewChild,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OsduGroup } from 'src/app/models/osdu-group.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
})
export class GroupListComponent implements OnChanges {
  @Input() groups: OsduGroup[] = [];
  @Input() filterData: boolean = false;
  @Input() filterUsers: boolean = false;
  @Input() filterService: boolean = false;

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  dataSource = new MatTableDataSource<OsduGroup>();
  filteredData = new MatTableDataSource<OsduGroup>();

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  readonly displayedColumns = ['actions', 'name', 'email', 'description'];

  ngOnChanges(): void {
    this.dataSource.data = this.groups;
    if (!this.paginator) return;

    if (
      (this.filterData && this.filterService && this.filterUsers) ||
      (!this.filterData && !this.filterService && !this.filterUsers)
    ) {
      this.filteredData.data = this.groups;
      this.filteredData.sort = this.sort;
      this.filteredData.paginator = this.paginator;
    } else {
      let filteredData;
      filteredData = this.dataSource.data.filter((group: OsduGroup) => {
        return (
          (this.filterData && group.name.startsWith('data')) ||
          (this.filterService && group.name.startsWith('service')) ||
          (this.filterUsers && group.name.startsWith('user'))
        );
      });
      this.filteredData.data = filteredData;
      this.paginator.length = this.filteredData.data.length;
      this.filteredData.paginator = this.paginator;
    }
  }
}
