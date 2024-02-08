import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { AddACLObjViewComponent } from '../add-acl/add-objview-acl.component';
import { OsduObject } from 'src/app/models/osdu-object.model';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-object-acl',
  templateUrl: './object-acl.component.html',
})
export class ObjectAclComponent implements OnInit {
  constructor(
    private restService: RestAPILayerService,
    private route: ActivatedRoute,
    private cmnSrvc: CommonService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  objectName: string = '';
  private objectId = '';

  record: OsduObject = {
    acl: { viewers: [], owners: [] },
    authority: null,
    createTime: null,
    createUser: null,
    data: null,
    id: null,
    kind: null,
    legal: null,
    namespace: null,
    source: null,
    tags: null,
    type: null,
    version: null,
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (!params.id) return;
      this.objectName = this.cmnSrvc.cleanAttributeID(params.id);
      this.objectId = params.id;
      this.getObject();
    });
  }

  getObject() {
    this.restService
      .getRecordFromStorageWithID(this.objectId)
      .subscribe((result) => {
        this.record = result;
      });
  }

  openModalAddACL() {
    this.dialog
      .open(AddACLObjViewComponent, { data: this.objectId })
      .afterClosed()
      .subscribe((added) => {
        if (!added) return;
        this.getObject();
      });
  }

  deleteAcl(acl: string, type: 'owners' | 'viewers') {
    from(
      swal.fire(
        Helper.warningSweetAlertConfirmConfig(
          `Are you sure you want to remove acl ${acl} from ${this.objectName}'s ${type}?`
        )
      )
    )
      .pipe(
        switchMap((result) => {
          if (!result.isConfirmed) return of(null);

          const newRecord = JSON.parse(JSON.stringify(this.record));

          newRecord.acl[type] = newRecord.acl[type].filter((el) => el !== acl);

          return this.restService.createOrUpdateRecords([newRecord]);
        })
      )
      .subscribe(
        (res) => {
          if (!res) return;
          this.snackBar.open(
            `${acl} has been succesfully removed from from ${this.objectName}'s ${type}`,
            null,
            Helper.snackBarSuccessConfig
          );
          this.getObject();
        },
        () => {
          swal.fire(Helper.errorSweetAlertConfig('An error occured.'));
        }
      );
  }
}
