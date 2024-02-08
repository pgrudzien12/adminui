import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { CommonService } from 'src/app/common/common.service';
import { Helper } from 'src/app/common/helper.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';

import { OsduObject } from 'src/app/models/osdu-object.model';
import swal from 'sweetalert2';

interface TableElement {
  version: string;
}

@Component({
  selector: 'app-object-versions',
  templateUrl: './object-versions.component.html',
  styleUrls: ['./object-versions.component.css'],
})
export class ObjectVersionsComponent implements OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() object: OsduObject;

  listVersions: TableElement[] = [];

  dataSource = new MatTableDataSource<TableElement>();

  objectIDWithoutVersion: string;

  displayedColumns = ['current', 'version', 'date'];

  constructor(
    private restService: RestAPILayerService,
    public cmnSrvc: CommonService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.object) return;
    this.objectIDWithoutVersion = Helper.getObjectIdWithoutVersion(
      this.object.id
    );

    if (changes.object.previousValue?.id === changes.object.currentValue?.id)
      return;

    this.restService
      .getRecordVersionsFromStorageWithID(this.objectIDWithoutVersion)
      .subscribe({
        next: this.handleSucess.bind(this),
        error: this.handleError.bind(this),
      });
  }

  private handleSucess(res: any) {
    this.listVersions = res['versions'].map((version) => ({
      version: Number(version),
    }));
    this.dataSource = new MatTableDataSource(this.listVersions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private handleError() {
    swal.fire(
      Helper.errorSweetAlertConfig('An error occured while getting versions')
    );
  }
}
