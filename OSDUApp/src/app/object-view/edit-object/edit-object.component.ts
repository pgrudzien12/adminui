import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { CommonService } from 'src/app/common/common.service';
import { Helper } from 'src/app/common/helper.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { OsduObject } from 'src/app/models/osdu-object.model';

import swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-edit-object',
  templateUrl: './edit-object.component.html',
  styleUrls: ['./edit-object.component.css'],
})
export class EditObjectComponent implements OnInit {
  loading = false;

  @ViewChild('confirmSwal')
  public readonly confirmSwal: SwalComponent;

  objectJson: OsduObject;
  objectJsonEditing: any;
  schema;
  id: string;
  properties = [];
  metaDataProperties = [];
  objectIDView = '';
  objectTypeView = '';
  confirmOptions: SweetAlertOptions = {
    ...Helper.warningSweetAlertConfirmConfig(''),
    width: 'auto',
  };

  constructor(
    private restService: RestAPILayerService,
    private route: ActivatedRoute,
    private cmnSrvc: CommonService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (!params.id) return;
      this.id = params.id;
      this.getObject();
    });
  }

  getObject() {
    this.loading = true;
    this.restService.getRecordFromStorageWithID(this.id).subscribe(
      (object) => {
        this.objectJson = object;
        this.objectJsonEditing = JSON.parse(JSON.stringify(object.data));
        this.getObjectSchemaByKind();
        this.objectIDView = this.cmnSrvc.cleanAttributeID(this.objectJson.id);
        this.objectTypeView = this.cmnSrvc.cleanAttributeKIND(
          this.objectJson.kind
        );
      },
      (error) => {
        swal.fire(Helper.errorSweetAlertConfig(error));
      }
    );
  }

  pushEditing() {
    const toPush = { ...this.objectJson, data: this.objectJsonEditing };

    this.confirmSwal.fire().then((result) => {
      if (result.isConfirmed) {
        this.restService.createOrUpdateRecords([toPush]).subscribe(
          () => {
            swal.fire(
              Helper.sucessSweetAlertConfig(
                'Object successfully updated with your changes'
              )
            );
            this.objectJson.data = JSON.parse(
              JSON.stringify(this.objectJsonEditing)
            );
          },
          (err) => {
            swal.fire(Helper.errorSweetAlertConfig(err));
          }
        );
      }
    });
  }

  getObjectSchemaByKind() {
    this.restService
      .getSchemaByKind(this.objectJson.kind)
      .subscribe((result) => {
        this.schema = result;
        this.properties = ['data'];
        this.metaDataProperties = Object.keys(this.schema.properties)
          .filter((key) => key !== 'data')
          .sort();

        this.loading = false;
      });
  }

  reset() {
    this.getObject();
  }

  compare() {
    document.getElementById('compare').click();
  }
}
