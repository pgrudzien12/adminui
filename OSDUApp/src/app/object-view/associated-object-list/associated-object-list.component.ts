import {
  Component,
  Input,
  ViewChild,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'src/app/common/common.service';
import { Router } from '@angular/router';
import { OsduObject } from 'src/app/models/osdu-object.model';
import { MatPaginator } from '@angular/material/paginator';
import { Helper } from 'src/app/common/helper.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-associated-object-list',
  templateUrl: './associated-object-list.component.html',
})
export class AssociatedObjectListComponent implements OnChanges, AfterViewInit {
  @Input() tabAssociatedData = [];
  @Input() dataKind = 'default';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<OsduObject> =
    new MatTableDataSource<OsduObject>();

  private readonly displayedColumnsDictionnary = {
    default: ['id', 'name', 'kind', 'version'],
    'File.Generic': ['id', 'name', 'filesize', 'kind', 'version'],
  };

  displayedColumns = [];

  navigateToObject(id: string) {
    this.router.navigate(['/object-view', id]);
  }

  Helper = Helper;

  constructor(public cmnSrvc: CommonService, private router: Router) {}

  ngOnChanges(): void {
    if (!this.tabAssociatedData) return;

    this.displayedColumns =
      this.displayedColumnsDictionnary[this.dataKind] ??
      this.displayedColumnsDictionnary.default;

    this.dataSource = new MatTableDataSource<OsduObject>(
      this.tabAssociatedData
    );
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
