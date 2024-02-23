import { Component, OnChanges, Input } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';
import { SelectDownloadComponent } from '../select-download/select-download.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { ConnectorService } from 'src/app/common/connector.service';

@Component({
  selector: 'app-associated-objects',
  templateUrl: './associated-objects.component.html',
  styleUrls: ['./associated-objects.component.css'],
})
export class AssociatedObjectsComponent implements OnChanges {
  tabAssociatedData = [];
  attributeCounterLink = 0;
  buildTabWithAssociastedObjectsData_done = false;
  tabAssociatedIndexFiles = undefined;
  listHeaderLink = [];
  listCountLink = [];
  listValueLink = [];
  dictionaryAssociatedObjs = [];
  associatedSelect = 'direct';
  listAssociatedObjs = [];
  buildTabObjectFilesAssociated_done = false;

  @Input() objectIDWithoutVersion;

  cleanAttributeID(attributes) {
    let indentation = '\xa0'.repeat(attributes.search(/\S/));
    return indentation + this.cmnSrvc.cleanAttributeID(attributes);
  }

  searchAssociated() {
    if (!this.objectIDWithoutVersion) return;

    this.listAssociatedObjs = [];
    this.listHeaderLink = [];
    this.listValueLink = [];
    this.listCountLink = [];
    this.tabAssociatedIndexFiles = -1;

    switch (this.associatedSelect) {
      case 'direct':
        this.searchAssociatedObj(this.objectIDWithoutVersion);
        return;
      case 'all':
        this.searchAllAssociatedObj(this.objectIDWithoutVersion);
        return;
      default:
        return;
    }
  }

  searchAssociatedObj(objId) {
    this.attributeCounterLink = -1;
    this.tabAssociatedIndexFiles = undefined;
    this.buildTabWithAssociastedObjectsData_done = false;
    this.buildTabObjectFilesAssociated_done = false;
    this.connectorService.getAssociatedObjects(objId).subscribe(
      (listAssociatedObjs) => {
        this.attributeCounterLink = 0;

        const index = listAssociatedObjs.indexOf(objId, 0);
        if (index > -1) {
          listAssociatedObjs.splice(index, 1);
        }

        this.listAssociatedObjs = listAssociatedObjs;
        this.cmnSrvc.listAssociatedObjs = this.listAssociatedObjs;
        if (listAssociatedObjs.length > 0) {
          this.groupAssociatedDataByKind(listAssociatedObjs);
          this.getAssociastedObjectsData(listAssociatedObjs);
          this.listAssociatedObjs.push(objId);
        } else {
          this.listHeaderLink = [];
          this.listValueLink = [];
          this.listCountLink = [];
          this.attributeCounterLink = 0;
        }
      },
      (err) => {
        swal.fire(Helper.errorSweetAlertConfig(err));
      }
    );
  }
  searchAllAssociatedObj(objId) {
    this.attributeCounterLink = -1;
    this.tabAssociatedIndexFiles = undefined;
    this.buildTabWithAssociastedObjectsData_done = false;
    this.buildTabObjectFilesAssociated_done = false;
    this.connectorService.getAllAssociatedObjects(objId).subscribe(
      (listAssociatedObjs) => {
        this.attributeCounterLink = 0;

        const index = listAssociatedObjs.indexOf(objId, 0);
        if (index > -1) {
          listAssociatedObjs.splice(index, 1);
        }

        this.listAssociatedObjs = listAssociatedObjs;
        this.cmnSrvc.listAssociatedObjs = this.listAssociatedObjs;
        if (listAssociatedObjs.length > 0) {
          this.groupAssociatedDataByKind(listAssociatedObjs);
          this.getAssociastedObjectsData(listAssociatedObjs);
          this.listAssociatedObjs.push(objId);
        } else {
          this.listHeaderLink = [];
          this.listValueLink = [];
          this.listCountLink = [];
          this.attributeCounterLink = 0;
        }
      },
      (err) => {
        swal.fire(Helper.errorSweetAlertConfig(err));
      }
    );
  }

  groupAssociatedDataByKind(resultAssociated) {
    this.dictionaryAssociatedObjs = [];
    const kindsAssociatedObjs = new Set<string>();

    for (let obj in resultAssociated) {
      let kind = this.cmnSrvc.cleanAttributeKIND(resultAssociated[obj]);
      if (!kindsAssociatedObjs.has(kind)) {
        kindsAssociatedObjs.add(kind);
        this.dictionaryAssociatedObjs.push({ name: kind, ids: [], count: 0 });
      }

      const index = this.dictionaryAssociatedObjs.findIndex(
        (item) => item.name === kind
      );
      this.dictionaryAssociatedObjs[index].ids.push(resultAssociated[obj]);
      this.dictionaryAssociatedObjs[index].count += 1;
    }
    for (let kind in this.dictionaryAssociatedObjs) {
      this.listHeaderLink.push(this.dictionaryAssociatedObjs[kind].name);
      this.listValueLink.push(this.dictionaryAssociatedObjs[kind].ids);
      this.listCountLink.push(this.dictionaryAssociatedObjs[kind].count);
      this.attributeCounterLink += 1;
    }

    this.tabAssociatedIndexFiles = this.dictionaryAssociatedObjs.findIndex(
      (item) => item.name === 'File.Generic'
    );
  }

  buildTabWithAssociastedObjectsData(resultAssociastedObjectsData) {
    this.tabAssociatedData = this.dictionaryAssociatedObjs.map((kind) =>
      kind.ids
        .map((objId) => {
          const idWithoutVersion = Helper.getObjectIdWithoutVersion(objId);
          const obj = resultAssociastedObjectsData.records.find(
            (item) => item.id === idWithoutVersion
          );
          if (!obj) return null;

          const versionId = Helper.getVersionFromId(objId);

          return {
            ...obj,
            id: objId,
            version: versionId ?? obj.version,
          };
        })
        .filter((obj) => obj !== null)
    );

    this.buildTabWithAssociastedObjectsData_done = true;
    this.buildTabObjectFilesAssociated();
  }

  getAssociastedObjectsData(listAssociatedObject) {
    this.restService.getListRecordsFromStorage(listAssociatedObject).subscribe(
      (resultAssociastedObjectsData) => {
        this.buildTabWithAssociastedObjectsData(resultAssociastedObjectsData);
      },
      (err) => {
        swal.fire(Helper.errorSweetAlertConfig(err));
      }
    );
  }

  buildTabObjectFilesAssociated() {
    let ids = [];
    let urls = [];
    let names = [];
    let filesSize = [];
    let signedUrlCount = 0;
    for (let file in this.tabAssociatedData[this.tabAssociatedIndexFiles]) {
      ids.push(this.tabAssociatedData[this.tabAssociatedIndexFiles][file].id);
      names.push(
        this.tabAssociatedData[this.tabAssociatedIndexFiles][file].data.Name
      );
      filesSize.push(
        this.tabAssociatedData[this.tabAssociatedIndexFiles][file].data
          .DatasetProperties.FileSourceInfo.FileSize
      );
      urls.push('');
    }
    for (let id in ids) {
      this.restService.downloadURLObjectFile(ids[id]).subscribe(
        (url) => {
          signedUrlCount++;
          urls[id] = url['SignedUrl'];
          if (signedUrlCount == names.length) {
            this.buildTabObjectFilesAssociated_done = true;
            this.cmnSrvc.tabObjectFilesAssociated = {
              ids: ids,
              urls: urls,
              names: names,
              filesSize: filesSize,
            };
          }
        },
        (err) => {
          swal.fire(Helper.errorSweetAlertConfig(err));
        }
      );
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  openModalSelectDownload() {
    this.modalService.open(SelectDownloadComponent);
  }

  constructor(
    private modalService: NgbModal,
    private restService: RestAPILayerService,
    private cmnSrvc: CommonService,
    private connectorService: ConnectorService
  ) {}

  ngOnChanges(): void {
    if (!this.objectIDWithoutVersion) return;

    this.listHeaderLink = [];
    this.listCountLink = [];
    this.listValueLink = [];
    this.dictionaryAssociatedObjs = [];
    this.tabAssociatedData = [];
    this.listAssociatedObjs = [];
    this.buildTabWithAssociastedObjectsData_done = false;
    this.buildTabObjectFilesAssociated_done = false;

    this.searchAssociated();
  }
}
