import {
  Component,
  OnChanges,
  Input,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { OsduObject } from '../models/osdu-object.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Helper } from 'src/app/common/helper.service';
import { Constants } from '../common/constants.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-osdu-object-list',
  templateUrl: './osdu-object-list.component.html',
})
export class OsduObjectListComponent implements OnChanges {
  private readonly mandatoryColumns = Constants.objectMandatoryColumns;

  @Input() objectList: OsduObject[] = [];
  @Input() length = null;
  @Input() templateColumns = [];
  @Input() selectable = false;
  @Input() selectActionsTemplate: TemplateRef<any>;
  @Input() canSelect: (osduObject: OsduObject) => boolean = () => true;

  selection = new SelectionModel<OsduObject>(true, []);

  Helper = Helper;

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

    this.objectList.forEach((obj) => {
      Object.keys(obj).forEach((key) => {
        headersSet.add(key);
      });
      if (obj.data)
        Object.keys(obj.data).forEach((key) => {
          headersSet.add(`data.${key}`);
        });
    });

    this.extraColumns = Array.from(headersSet.values())
      .filter((el) => !this.mandatoryColumns.find((m) => m === el))
      .sort();

    this.allColumns = [...this.mandatoryColumns, ...headersSet.values()];

    this.dataSource = new MatTableDataSource(this.objectList);

    this.dataSource.paginator = this.paginator;

    this.selection = new SelectionModel<OsduObject>(true, []);
  }

  getExtraField(element: OsduObject, key: string) {
    return Helper.getFieldFromDottedString(element, key);
  }

  isSimpleData(element, key) {
    const field = Helper.getFieldFromDottedString(element, key);
    return (
      !field ||
      typeof field === 'string' ||
      typeof field === 'number' ||
      typeof field === 'boolean'
    );
  }

  getObjectParentString(element: OsduObject, key: string) {
    return `${element.id} > ${key.split('.').join(' > ')}`;
  }

  displayedColumnsChange(event: string[]) {
    this.displayedColumns = [
      ...(this.selectable ? ['select'] : []),
      ...event,
      ...this.templateColumns.map((el) => el.id),
    ];
  }
}
