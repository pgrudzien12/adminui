import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AddServiceAccComponent } from '../add-service-acc/add-service-acc.component';
import { edsList, eds_OSDUPlatformImplementation } from 'src/config';
import { AddServiceAgreementComponent } from '../add-service-agreement/add-service-agreement.component';
import Stepper from 'bs-stepper';
import { Router } from '@angular/router';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-external-data-source',
  templateUrl: './external-data-source.component.html',
  styleUrls: ['./external-data-source.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ExternalDataSourceComponent implements OnInit {
  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};
  pageSize = 8;
  myInput;
  page = 1;
  regSourcesList: any = [];
  ngSources = '0';
  ngSelectedPlatform = '0';
  ngServiceAcc = '0';
  ngAgrrementIDs = '0';
  ngSelectedSourceID = '';
  ngSelectedSourceName = '';
  ngSourceDesc = '';
  isViewSelected: boolean = false;
  serviceAccList = [];
  svcAccDetails = [];
  serviceAgrrementList = [];
  trackByFn;
  selectedRegSourceList = [];
  platformImplementationList = eds_OSDUPlatformImplementation;
  sourceRegFinalResult: any;
  SourceRegDetail;
  stepper: Stepper;
  ServiceAccountHeader = [];
  isPreview: boolean = false;
  isViewSourceTable: boolean = true;
  isNameError: boolean = false;

  isSuccess: boolean = false;
  isError: boolean = false;
  successMessge = '';
  errorMessge = '';
  eds_connectionsource_List;

  legalTagNameList = [];
  aclList = [];
  selectedLegalTagNames;
  selectedACLOwnerNames;
  selectedACLViewerNames;

  kind_value = '';
  // private formlyJsonschema: FormlyJsonschema,
  constructor(
    public router: Router,
    private modalService: NgbModal,
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private spinner: NgxSpinnerService
  ) {
    this.cmnSrvc.sideNavLists = edsList[0]['sideValues'];
    this.cmnSrvc.SideNavHeader = edsList[0]['header'];
    this.cmnSrvc.bkgndColor = 'eds';
  }

  ngOnInit(): void {
    this.kind_value =
      environment.settings.data_partition +
      ':wks:master-data--ConnectedSourceRegistryEntry:1.0.0';
    this.isViewSourceTable = true;
    this.cmnSrvc.sideNavLists = edsList[0]['sideValues'];
    this.cmnSrvc.SideNavHeader = edsList[0]['header'];

    this.spinner.show();

    this.getConnectionSourceEntry();
    this.getLegalTag();
    this.getEntitlements();

    // this.regSourcesList=this.eds_connectionsource_List.map(x=>x["data"]["Name"])
  }

  getLegalTag() {
    this.spinner.show();
    this.restService.getLegalTagList().subscribe(
      (result) => {
        let tempList = [];
        result.legalTags.forEach((element) => {
          tempList.push({ item_id: element.name, item_text: element.name });
        });
        this.legalTagNameList = tempList;
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          closeDropDownOnSelection: true,
          itemsShowLimit: 2,
          allowSearchFilter: true,
          maxHeight: 150,
        };

        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getEntitlements() {
    this.spinner.show();
    this.restService.getEntitlementGroups().subscribe(
      (result) => {
        this.spinner.hide();

        if (result.groups.length > 0) {
          let tempList = [];
          result.groups.forEach((element) => {
            tempList.push({ item_id: element.email, item_text: element.email });
          });
          this.aclList = tempList;
          this.dropdownSettings1 = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            closeDropDownOnSelection: true,
            itemsShowLimit: 2,
            allowSearchFilter: true,
            maxHeight: 150,
          };
        }
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  getConnectionSourceEntry() {
    this.spinner.show();

    const data = {
      kind: this.kind_value,
    };
    this.restService.getConnectionSourceRegistry(data).subscribe(
      (result) => {
        this.spinner.hide();
        this.eds_connectionsource_List = result['results'];
        this.cmnSrvc.externalDataSources = result['results'];
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  newreturnid() {
    return 'xxxxxxxxxxxx'.replace(/[x]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  openModalEdit(type, source) {
    this.isViewSelected = true;
    this.isViewSourceTable = false;
    let tempSourceDetails;
    this.ServiceAccountHeader = [];
    if (type == 'tblValue') {
      tempSourceDetails = source;
    } else {
      tempSourceDetails = this.eds_connectionsource_List.filter(
        (x) => x['id'] == source
      )[0];
    }

    this.selectedRegSourceList = tempSourceDetails;
    this.ngSources = tempSourceDetails['id'];
    this.ngSelectedSourceID = tempSourceDetails['id'];
    this.ngSelectedSourceName = tempSourceDetails['data']['Name'];
    this.ngSourceDesc = tempSourceDetails['data']['Description'];
    if (tempSourceDetails['data']['FullOSDUImplementationIndicator']) {
      this.ngSelectedPlatform = this.platformImplementationList[0];
    } else {
      this.ngSelectedPlatform = this.platformImplementationList[1];
    }
    this.selectedACLOwnerNames = tempSourceDetails['acl']['owners'];
    this.selectedACLViewerNames = tempSourceDetails['acl']['viewers'];
    this.selectedLegalTagNames = tempSourceDetails['legal']['legaltags'];
    // let schema=this.eds_connectionsource_List["data"]["SecuritySchemes"];
    //   if(schema !=undefined){
    //     if(schema.length>0){
    //       this.ServiceAccountHeader=Object.keys(schema[0]);
    //     }
    //   }
    Object.keys(
      this.selectedRegSourceList['data']['SecuritySchemes'][0]
    ).forEach((element) => {
      this.ServiceAccountHeader.push(element);
    });
    this.ServiceAccountHeader.sort();
    if (tempSourceDetails['data']['AgreementIDs'] != undefined) {
      if (tempSourceDetails['data']['AgreementIDs'].length > 0) {
        this.serviceAgrrementList = tempSourceDetails['data']['AgreementIDs'];
      } else {
        this.serviceAgrrementList = [];
      }
    } else {
      this.serviceAgrrementList = [];
    }
    if (tempSourceDetails['data'].SecuritySchemes != undefined) {
      if (tempSourceDetails['data'].SecuritySchemes.length > 0) {
        this.serviceAccList = tempSourceDetails['data'].SecuritySchemes;
      } else {
        this.serviceAccList = [];
      }
    } else {
      this.serviceAccList = [];
    }
  }

  openModalAdd() {
    this.isViewSelected = true;
    this.isViewSourceTable = false;
    this.ngSelectedSourceID = '';
    this.ngSelectedSourceName = '';
    this.ngSourceDesc = '';
    this.ngSelectedPlatform = '0';
    this.serviceAgrrementList = [];
    this.serviceAccList = [];
    this.selectedACLOwnerNames = [];
    this.selectedACLViewerNames = [];
    this.selectedLegalTagNames = [];
    this.successMessge = '';
    this.errorMessge = '';

    const id =
      environment.settings.data_partition +
      ':master-data--' +
      'ConnectedSourceRegistryEntry:' +
      this.newGuid();
    this.ngSelectedSourceID = id;
  }

  deleteAgrreentId(val) {
    let that = this;

    swal
      .fire(
        Helper.warningSweetAlertConfirmConfig(
          'Are you sure you want to delete ' + val + '?'
        )
      )
      .then((result) => {
        if (result.isConfirmed) {
          that.serviceAgrrementList = that.serviceAgrrementList.filter(
            (x) => x != val
          );
        }
      });
  }

  openModalAddAgreement(type) {
    const modalRef = this.modalService.open(AddServiceAgreementComponent);
    modalRef.componentInstance.Type = type;
    modalRef.componentInstance.AgreementName = this.ngAgrrementIDs;
    modalRef.componentInstance.ServiceAgreementList = this.serviceAgrrementList;
    let that = this;
    modalRef.componentInstance.passEntryAdd.subscribe((result) => {
      that.serviceAgrrementList.push(result.data);
    });
  }

  openModalEditAgreement(Val) {
    const modalRef = this.modalService.open(AddServiceAgreementComponent);
    modalRef.componentInstance.Type = 'edit';
    modalRef.componentInstance.AgreementName = Val;
    modalRef.componentInstance.ServiceAgreementList = this.serviceAgrrementList;
    let that = this;
    modalRef.componentInstance.passEntryAdd.subscribe((result) => {
      that.serviceAgrrementList = that.serviceAgrrementList.filter(
        (x) => x != result.data.previous_name
      );
      that.serviceAgrrementList.push(result.data.new_name);
    });
  }

  openModalAddServiceAcc(type) {
    const modalRef = this.modalService.open(AddServiceAccComponent);
    modalRef.componentInstance.Type = type;
    let that = this;
    modalRef.componentInstance.passEntry.subscribe((result) => {
      that.serviceAccList.push(result.data);
    });
  }
  nameValidation(val) {
    const format = /[!@#$%^&*~()+\=\[\]{};':"\\|,.<>\/?]+/;

    if (format.test(val)) {
      this.isNameError = true;
      return true;
    } else {
      this.isNameError = false;
      return false;
    }
  }

  openModalEditServiceAcc(Val) {
    const modalRef = this.modalService.open(AddServiceAccComponent);
    modalRef.componentInstance.Type = 'edit';
    modalRef.componentInstance.ServiceDetails = Val;
    modalRef.componentInstance.passEntry.subscribe((result) => {
      this.serviceAccList = result.data;
    });
  }

  saveSource() {
    let count = 0;
    this.ServiceAccountHeader = [];
    for (let element in this) {
      if (element.includes('ngSelected')) {
        if (this[element].toString() === '') {
          count += 1;
        } else if (this[element].toString() === '0') {
          count += 1;
        }
      }
    }
    if (this.serviceAccList.length == 0) {
      count += 1;
    }
    if (count > 0) {
      this.isError = true;
      this.errorMessge = 'Please enter all the required fields';
    } else {
      this.isError = false;
      this.sourceRegFinalResult = this.selectedRegSourceList;
      this.sourceRegFinalResult['data'] = {
        Name: this.ngSelectedSourceName,
        Description: this.ngSourceDesc,
        FullOSDUImplementationIndicator: this.ngSelectedPlatform,
        AgreementIDs: this.serviceAgrrementList,
        ServiceAccounts: this.serviceAccList,
      };
      this.sourceRegFinalResult['ID'] = this.ngSelectedSourceID;
      this.SourceRegDetail = this.sourceRegFinalResult;
      // Object.keys(this.SourceRegDetail.data.ServiceAccounts[0]).forEach(element => {
      //   this.ServiceAccountHeader.push(element)
      // });

      let platform_Implementation;
      if (this.ngSelectedPlatform == 'Full OSDU Platform') {
        platform_Implementation = true;
      } else {
        platform_Implementation = false;
      }

      let ownerlist,
        vieweList,
        legalList = [];
      if (this.selectedACLOwnerNames != undefined) {
        if (this.selectedACLOwnerNames.length > 0) {
          ownerlist = this.selectedACLOwnerNames.map((x) => x.item_id);
        } else {
          ownerlist = environment.settings.eds.acl.owners;
        }
      } else {
        ownerlist = environment.settings.eds.acl.owners;
      }
      if (this.selectedACLViewerNames != undefined) {
        if (this.selectedACLViewerNames.length > 0) {
          vieweList = this.selectedACLViewerNames.map((x) => x.item_id);
        } else {
          vieweList = environment.settings.eds.acl.viewers;
        }
      } else {
        vieweList = environment.settings.eds.acl.viewers;
      }
      if (this.selectedLegalTagNames != undefined) {
        if (this.legalTagNameList.length > 0) {
          legalList = this.legalTagNameList.map((x) => x.item_id);
        } else {
          legalList = environment.settings.eds.legal.legaltags;
        }
      } else {
        legalList = environment.settings.eds.legal.legaltags;
      }

      // this.stepper.next();
      const data = {
        runId: this.ngSelectedSourceName + '-' + this.newGuid(),
        executionContext: {
          acl: environment.settings.eds.acl,
          legal: environment.settings.eds.legal,
          Payload: environment.settings.eds.Payload,
          manifest: {
            kind: 'osdu:wks:Manifest:1.0.0',
            MasterData: [
              {
                id: this.ngSelectedSourceID,
                kind: this.kind_value,
                data: {
                  Name: this.ngSelectedSourceName,
                  Description: this.ngSourceDesc,
                  FullOSDUImplementationIndicator: platform_Implementation,
                  AgreementID: this.serviceAgrrementList,
                  SecuritySchemes: this.serviceAccList,
                },
                legal: {
                  legaltags: legalList,
                  otherRelevantDataCountries:
                    environment.settings.eds.legal.otherRelevantDataCountries,
                },
                acl: {
                  owners: ownerlist,
                  viewers: vieweList,
                },
              },
            ],
          },
        },
      };
      this.spinner.show();
      this.restService.postConnectionSourceRegistry(data).subscribe(
        (result) => {
          this.spinner.hide();
          if (typeof result != 'string') {
            this.isSuccess = true;
            this.successMessge =
              "You have successfully submitted the Connection Source Registry. Please note that your run id is '" +
              result['runId'] +
              "'";
          } else {
            this.isError = true;
            this.errorMessge = result;
          }
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  previous() {
    this.isViewSourceTable = true;
    this.isViewSelected = false;
    //this.stepper.previous()
  }

  resetForm() {
    this.ngSelectedPlatform = '0';
    this.ngSelectedSourceID = '';
    this.ngSelectedSourceName = '';
    this.ngServiceAcc = '0';
    this.ngSourceDesc = '';
    this.ngAgrrementIDs = '0';
  }

  navigateDataJob(source) {
    this.router.navigate(['/EDS/DataJob'], { queryParams: { id: source } });
  }
}
