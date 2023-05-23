import { Component, OnChanges, Input, ViewChild } from '@angular/core';
import { OsduObject } from '../models/osdu-object.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Helper } from 'src/app/common/helper.service';

@Component({
  selector: 'app-osdu-object-list',
  templateUrl: './osdu-object-list.component.html',
})
export class OsduObjectListComponent implements OnChanges {
  private readonly mandatoryColumns = Helper.objectMandatoryColumns;

  @Input() objectList: OsduObject[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [];

  allColumns: string[] = [];

  extraColumns: string[] = [];

  dataSource = new MatTableDataSource();

  ngOnChanges(): void {
    if (!this.objectList) return;

    this.dataSource = new MatTableDataSource();

    this.extraColumns = [];

    const headersSet = new Set<string>();

    const data = this.objectList.map((obj) => {
      const res = {
        id: obj.id,
        legal: obj.legal,
      };

      Object.keys(obj.data).forEach((key) => {
        headersSet.add(key);

        res[key] = obj.data[key];
      });

      return res;
    });

    this.extraColumns = [...headersSet.values()];

    this.extraColumns.sort();

    this.allColumns = [...this.mandatoryColumns, ...headersSet.values()];

    this.dataSource = new MatTableDataSource(data);

    this.dataSource.paginator = this.paginator;
  }

  getExtraField(element: OsduObject, key: string) {
    if (!element || !element[key]) return 'null';
    return element[key];
  }

  isSimpleData(element, key) {
    return (
      !element[key] ||
      typeof element[key] === 'string' ||
      typeof element[key] === 'number' ||
      typeof element[key] === 'boolean'
    );
  }

  getObjectParentString(element: OsduObject, key: string) {
    return `${element.id} > ${key}`;
  }

  displayedColumnsChange(event: string[]) {
    this.displayedColumns = event;
  }
}
