import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { SelectDownloadComponent } from '../select-download/select-download.component';

import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';
import { ObjectViewHelper } from '../object-view.helper';

@Component({
  selector: 'app-object-view-main',
  templateUrl: './object-view-main.component.html',
  styleUrls: ['./object-view-main.component.css'],
})
export class ObjectViewMainComponent implements OnInit {
  modalOptions: NgbModalOptions;
  listNamesWells;
  listCoordsWells;
  objectID;
  objectJson;
  objIdSearch;
  objectIDView;
  objectTypeView;
  objectVersionView;

  metadata = null;

  listVersions = [];
  objectIDWithoutVersion;
  toolTipBackButton = '';

  diffReport: any;
  versioningSelectedVersion;
  versioningSelectedVersionClick;
  objectJsonToCompare;
  viewVersioning: boolean = false;

  object1 = {
    id: 'ID1',
    version: 12,
    kind: 'well',
  };

  value: any = [
    {
      id: 'ID01',
      version: '45455',
    },
  ];

  resolveAllOf = require('json-schema-resolve-allof');

  schemaAdapted;

  error: string;

  private readonly objectViewUrl = '/object-view';

  print(): string {
    return JSON.stringify(this.value, null, 2);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private spinner: NgxSpinnerService,
    private objectViewHelper: ObjectViewHelper
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
    this.cmnSrvc.bkgndColor = 'ObjectView';
  }

  get canDelete() {
    return (
      this.objectID &&
      this.objectJson &&
      !this.objectJson.kind.includes(':master-data-')
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const objectID = params.id;
      this.cmnSrvc.listAssociatedObjs = [];

      if (!objectID) return;

      this.cmnSrvc.objectID = objectID;
      this.objectID = objectID;
      this.objIdSearch = objectID;
      this.searchObjectID(this.objectID);
    });
  }

  searchObjects(search) {
    if (this.isRegexID(search)) {
      this.router.navigate([this.objectViewUrl, search]);
    } else {
      this.openModalSearchQuery(search);
    }
  }

  deleted() {
    this.cmnSrvc.objectID = undefined;
    this.router.navigate([this.objectViewUrl]);
  }

  openModalSearchQuery(search) {
    this.cmnSrvc.searchQuery = search;
    this.router.navigate(['/search-query'], {
      queryParams: {
        searchQueryRequest: search,
      },
    });
  }

  searchObjectID(objId) {
    if (objId.endsWith(':')) {
      objId = objId.slice(0, -1);
    }
    this.restService.getRecordFromStorageWithID(objId).subscribe(
      (result) => {
        this.spinner.show();

        this.reinitialiseVersionning();
        this.cmnSrvc.objectID = objId;
        this.objectID = objId;
        this.objectJson = result;
        this.buildView(result);
        this.getVersions(objId);
        this.spinner.hide();
      },
      (err) => {
        swal.fire(Helper.errorSweetAlertConfig(err));

        this.spinner.hide();
      }
    );
  }

  counter(i: number) {
    return new Array(i);
  }

  buildView(result) {
    this.buildViewMeta();
    this.objectIDView = this.cleanAttributeID(result['id']);
    this.objectTypeView = this.cmnSrvc.cleanAttributeKIND(result['kind']);
    this.objectVersionView = result['version'];
  }
  buildViewMeta() {
    const metadata = { ...this.objectJson };
    delete metadata.data;
    this.metadata = metadata;
  }

  isRegexID(objId) {
    const IDReg = /^[\w\-\.]+:[\w\-\.]+\-\-[\w\.]+:[\w\-\.\:\%]+$/;
    return IDReg.test(objId);
  }

  downloadJsonObject() {
    const jsonSpace = 2;
    const blob = new Blob([JSON.stringify(this.objectJson, null, jsonSpace)], {
      type: 'application/json',
    });
    saveAs(blob, this.objectID + '.json');
  }

  openACL() {
    this.router.navigate(['/object-view', this.objectID, 'acl']);
  }

  cleanAttributeID(attributes) {
    return this.objectViewHelper.cleanAttributeID(attributes);
  }

  getVersions(objId) {
    this.objectIDWithoutVersion = Helper.getObjectIdWithoutVersion(objId);

    if (this.isReferenceData) {
      return;
    }
    this.restService
      .getRecordVersionsFromStorageWithID(this.objectIDWithoutVersion)
      .subscribe(
        (result) => {
          this.spinner.show();

          this.listVersions = result['versions'];

          this.spinner.hide();
        },
        (err) => {
          swal.fire(Helper.errorSweetAlertConfig(err));
          this.spinner.hide();
        }
      );
  }

  // Management of VERSIONNING
  compare() {
    this.versioningSelectedVersionClick = this.versioningSelectedVersion;
    this.viewVersioning = true;
    document.getElementById('compare').click();
  }

  differenceReport(event) {
    this.diffReport = event;
  }

  reinitialiseVersionning() {
    this.listVersions = [];
    this.viewVersioning = false;
    this.versioningSelectedVersionClick = undefined;
    this.versioningSelectedVersion = undefined;
    this.objectJsonToCompare = undefined;
  }

  getVersionOfObject(version) {
    this.restService
      .getRecordFromStorageWithID(this.objectIDWithoutVersion + ':' + version)
      .subscribe(
        (result) => {
          this.spinner.show();
          this.objectJsonToCompare = result;
          this.spinner.hide();
        },
        (err) => {
          swal.fire(Helper.errorSweetAlertConfig(err));
          this.spinner.hide();
        }
      );
  }

  // DOWNLOAD
  openModalSelectDownload() {
    this.modalService.open(SelectDownloadComponent);
  }

  downloadObjectFile(dataset_id) {
    this.restService.downloadURLObjectFile(dataset_id).subscribe(
      (result) => {
        this.spinner.show();
        this.restService.downloadURLSignedDirect(result['SignedUrl']);
        this.spinner.hide();
      },
      (err) => {
        swal.fire(Helper.errorSweetAlertConfig(err));
        this.spinner.hide();
      }
    );
  }

  get isReferenceData() {
    return (
      this.objectTypeView === 'File.Generic' ||
      this.objectID.includes('reference-data--')
    );
  }

  switchToEditView() {
    this.router.navigate(['/object-view', this.objectID, 'edit']);
  }

  kindGetr(list1, list2) {
    for (let i = 0; i < Object.keys(list1).length; i++) {
      if (list1[i] === 'kind') {
        if (list2[i].includes('master')) {
          const b = list2[i]
            .toString()
            .replace(
              'osdu:wks:master-data--',
              'https://community.opengroup.org/osdu/data/data-definitions/-/blob/master/E-R/master-data/'
            );
          const c = b.concat('.md');
          const d = c.replace(':1', '.1');
          window.open(d);
        }
        if (list2[i].includes('component')) {
          const b = list2[i]
            .toString()
            .replace(
              'osdu:wks:work-product-component--',
              'https://community.opengroup.org/osdu/data/data-definitions/-/blob/master/E-R/work-product-component/'
            );
          const c = b.concat('.md');
          const d = c.replace(':1', '.1');
          window.open(d);
        }
        if (list2[i].includes('reference')) {
          const b = list2[i]
            .toString()
            .replace(
              'osdu:wks:reference-data--',
              'https://community.opengroup.org/osdu/data/data-definitions/-/tree/master/E-R/reference-data/'
            );
          const c = b.concat('.md');
          const d = c.replace(':1', '.1');
          window.open(d);
        }
      }
    }
  }
}
