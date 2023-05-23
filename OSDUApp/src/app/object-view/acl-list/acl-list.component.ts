import {
  Component,
  OnChanges,
  Input,
  SimpleChanges,
  ViewChild,
  TemplateRef,
  ContentChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-acl-list',
  templateUrl: './acl-list.component.html',
})
export class AclListComponent implements OnChanges {
  @Input() acl: string[] = [];

  @ContentChild(TemplateRef) templateRef: TemplateRef<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<string>(this.acl);

  @Input() displayedColumns = ['actions', 'id'];

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.acl) return;

    this.dataSource = new MatTableDataSource(this.acl);

    this.dataSource.paginator = this.paginator;
  }
}
