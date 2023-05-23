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

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
})
export class GroupListComponent implements OnChanges {
  @Input() groups: OsduGroup[] = [];
  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  dataSource = new MatTableDataSource<OsduGroup>();

  @ViewChild('paginator') paginator: MatPaginator;

  readonly displayedColumns = ['actions', 'name', 'email', 'description'];

  ngOnChanges(): void {
    if (!this.paginator) return;

    this.dataSource = new MatTableDataSource(this.groups);

    this.dataSource.paginator = this.paginator;
  }
}
