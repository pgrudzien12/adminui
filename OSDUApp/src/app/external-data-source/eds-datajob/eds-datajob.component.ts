import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddDatajobWorkflowComponent } from '../add-datajob-workflow/add-datajob-workflow.component';

import { edsList, eds_datajob } from 'src/config';

import Stepper from 'bs-stepper';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-eds-datajob',
  templateUrl: './eds-datajob.component.html',
  styleUrls: ['./eds-datajob.component.css'],
})
export class EdsDatajobComponent implements OnInit {
  isSuccess: boolean = false;
  isError: boolean = false;
  successMessge = '';
  errorMessge = '';

  stepper: Stepper;
  DataJobList = [];
  EDSDataJobFullList = [];
  EDSWorkFlowList = [];
  selectedDataFlowDetail = [];
  ngRegSource = '0';
  ngDataJob = '0';
  ngWorkFlow = '0';
  ngSelectedJobID = '';
  ngSelectedJobName = '';
  ngSelectedFetchKind = '';
  ngFetchFilter = '';
  ngSelectedUTC = '';
  ngJobActive;
  ngFinalJobActive = '';
  ngSelectedSourcePartition = '';
  ngSelectedIngestionPartition = '';
  isViewSelected: boolean = false;
  isPreview: boolean = false;
  isSrcNameError: boolean = false;
  isIngNameError: boolean = false;

  WorkFlowPreviewHeader = [];
  ParameterHeaderCount = [];
  DataJobFinalResult;
  regSourcesList: any = [];
  isViewDataJob: boolean = false;
  serviceAccountNameList = [];
  eds_connectionsource_list;
  connectedSourceId = '';

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
    this.spinner.show();
    if (this.cmnSrvc.externalDataSources == undefined) {
      this.getConnectionSourceEntry();
    } else {
      this.eds_connectionsource_list = this.cmnSrvc.externalDataSources;
    }

    let href = this.router.url;
    if (href.includes('?id')) {
      let id = href.split('?')[1].split('=')[1];
      this.connectedSourceId = id;

      this.getConnectionSourceDataJob();
    } else {
      this.ngRegSource = '0';
    }
  }

  nameValidation(val, type) {
    const format = /[!@#$%^&*~()+\=\[\]{};':"\\|,.<>\/?]+/;
    let iserror: boolean = false;

    if (format.test(val)) {
      iserror = true;
      //return true;
    } else {
      iserror = false;
      // return false;
    }
    if (type == 'source') {
      this.isSrcNameError = iserror;
    } else {
      this.isIngNameError = iserror;
    }
  }

  getConnectionSourceEntry() {
    this.spinner.show();
    let kind_value =
      environment.settings.data_partition +
      ':wks:master-data--ConnectedSourceRegistryEntry:1.0.0';
    const data = {
      kind: kind_value,
    };
    this.restService.getConnectionSourceRegistry(data).subscribe(
      (result) => {
        this.spinner.hide();
        this.eds_connectionsource_list = result['results'];
        this.cmnSrvc.externalDataSources = result['results'];
        this.ngRegSource = this.connectedSourceId;
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  getConnectionSourceDataJob() {
    this.spinner.show();

    const data = {
      kind: 'osdu:wks:master-data--ConnectedSourceDataJob:1.0.0',
      query:
        'data.ConnectedSourceRegistryEntryID:' +
        ' "' +
        this.connectedSourceId +
        '"',
    };
    this.restService.getConnectionSourceDataJob(data).subscribe(
      (result) => {
        this.spinner.hide();
        this.DataJobList.push(eds_datajob.data.Name);
        this.EDSDataJobFullList = result['results'];
        if (this.EDSDataJobFullList.length > 0) {
          this.ngDataJob = this.EDSDataJobFullList[0].id;
          this.isViewDataJob = true;
          this.openModalEdit('edit', this.ngDataJob);
        } else {
          this.resetForm('job');
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
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

  openModalEdit(type, val) {
    this.spinner.show();
    let tempList = [];
    this.isViewSelected = true;
    this.selectedDataFlowDetail = [];
    if (type == 'add') {
      this.ngWorkFlow = '0';
      this.ngSelectedJobName = '';
      this.ngSelectedFetchKind = '';
      this.ngFetchFilter = '';
      this.ngSelectedUTC = '';
      this.ngJobActive = false;
      const id =
        environment.settings.data_partition +
        ':master-data--' +
        'ConnectedSourceDataJob:' +
        this.newGuid();
      this.ngSelectedJobID = id;
      this.EDSWorkFlowList = [];
    } else {
      //  tempList.push(eds_datajob)
      tempList = this.EDSDataJobFullList.filter((x) => x.id == val)[0];
      this.selectedDataFlowDetail = tempList;
      this.ngSelectedJobID = this.selectedDataFlowDetail['id'];
      this.EDSWorkFlowList = this.selectedDataFlowDetail['data']['Workflows'];
      this.ngSelectedJobName = this.selectedDataFlowDetail['data']['Name'];
      this.ngSelectedFetchKind =
        this.selectedDataFlowDetail['data']['FetchKind'];
      this.ngFetchFilter = this.selectedDataFlowDetail['data']['Filter'];
      this.ngSelectedUTC = this.selectedDataFlowDetail['data']['ScheduleUTC'];
      this.ngJobActive = this.selectedDataFlowDetail['data']['ActiveIndicator'];
      this.ngSelectedSourcePartition =
        this.selectedDataFlowDetail['data']['ConnectedSourceDataPartitionID'];
      this.ngSelectedIngestionPartition =
        this.selectedDataFlowDetail['data']['OnIngestionPartitionID'];
    }
    this.spinner.hide();
  }

  openModalAddWorkFlow(type) {
    const modalRef = this.modalService.open(AddDatajobWorkflowComponent);
    modalRef.componentInstance.Type = type;
    modalRef.componentInstance.serviceAccountNameList =
      this.serviceAccountNameList;
    if (type == 'edit') {
      let selServiceList = this.EDSWorkFlowList.filter(
        (x) => x.Tag == this.ngWorkFlow
      );
      modalRef.componentInstance.WorkFlowDetails = selServiceList;
    }

    let that = this;
    modalRef.componentInstance.passEntryWorkFlow.subscribe((result) => {
      if (type == 'add') {
        that.EDSWorkFlowList.push({
          Tag: result.data.Tag,
          Handler: result.data.Handler,
          Parameters: result.data.Parameters,
          URL: result.data.URL,
          ServiceAccountName: result.data.ServiceAccountName,
        });
      } else {
        that.EDSWorkFlowList.forEach((element) => {
          if (element.Tag == result.data.PreviousTagName) {
            element.Tag = result.data.Tag;
            element.Handler = result.data.Handler;
            element.Parameters = result.data.Parameters;
            element.URL = result.data.URL;
            element.ServiceAccountName = result.data.ServiceAccountName;
          }
        });
      }
    });
  }

  openModalEditWorkFlow(val) {
    const modalRef = this.modalService.open(AddDatajobWorkflowComponent);
    modalRef.componentInstance.Type = 'edit';
    modalRef.componentInstance.serviceAccountNameList =
      this.serviceAccountNameList;
    modalRef.componentInstance.WorkFlowDetails = val;
    let that = this;
    modalRef.componentInstance.passEntryWorkFlow.subscribe((result) => {
      that.EDSWorkFlowList.forEach((element) => {
        if (element.Tag == result.data.PreviousTagName) {
          element.Tag = result.data.Tag;
          element.Handler = result.data.Handler;
          element.Parameters = result.data.Parameters;
          element.URL = result.data.URL;
          element.ServiceAccountName = result.data.ServiceAccountName;
        }
      });
    });
  }

  previewDataJobRegistry() {
    let count = 0;
    this.WorkFlowPreviewHeader = [];
    let DataJobResult = [];
    for (let element in this) {
      if (element.includes('ngSelected')) {
        if (this[element].toString() === '') {
          count += 1;
        } else if (this[element].toString() === '0') {
          count += 1;
        }
      }
    }
    if (this.EDSWorkFlowList.length == 0) {
      count += 1;
    }
    if (count > 0) {
      this.isError = true;
      this.errorMessge = 'Please enter all the required fields';
    } else {
      // let wfcount=0;
      // let tagvlues=this.EDSWorkFlowList.map(x=>x.Tag);
      // if(tagvlues.toString().toLowerCase().includes("fetch") && tagvlues.toString().toLowerCase().includes("delivery")){
      //   wfcount+=1;
      // }

      // if(wfcount==0){
      //   this.isError=true;
      //   this.isSuccess=false;
      //   this.errorMessge="A data job should contain atleast a Fetch and a Delivery Work Flow."
      // }
      // else{
      this.isError = false;
      DataJobResult = this.selectedDataFlowDetail;
      DataJobResult['data'] = {
        Name: this.ngSelectedJobName,
        // "ConnectedSourceRegistryEntryID": this.ngSelectedJobID,
        ActiveIndicator: this.ngJobActive,
        FetchKind: this.ngSelectedFetchKind,
        Filter: this.ngFetchFilter,
        ScheduleUTC: this.ngSelectedUTC,
        Workflows: this.EDSWorkFlowList,
      };
      DataJobResult['ID'] = this.ngSelectedJobID;
      this.DataJobFinalResult = DataJobResult;
      this.ngFinalJobActive = this.ngJobActive;
      //this.SourceRegDetail=this.sourceRegFinalResult;
      Object.keys(this.DataJobFinalResult['data']['Workflows'][0]).forEach(
        (element) => {
          this.WorkFlowPreviewHeader.push(element);
        }
      );

      const data = {
        runId: this.ngSelectedJobName.replace(/ /g, '_') + '-' + this.newGuid(),
        executionContext: {
          acl: environment.settings.eds.acl,
          legal: environment.settings.eds.legal,
          Payload: environment.settings.eds.Payload,
          manifest: {
            kind: 'osdu:wks:Manifest:1.0.0',
            MasterData: [
              {
                id: this.ngSelectedJobID,
                kind: 'osdu:wks:master-data--ConnectedSourceDataJob:1.0.0',
                data: {
                  Name: this.ngSelectedJobName,
                  ConnectedSourceRegistryEntryID: this.ngRegSource,
                  ActiveIndicator: this.ngJobActive,
                  FetchKind: this.ngSelectedFetchKind,
                  Filter: this.ngFetchFilter,
                  ConnectedSourceDataPartitionID:
                    this.ngSelectedSourcePartition,
                  ScheduleUTC: this.ngSelectedUTC,
                  OnIngestionPartitionID: this.ngSelectedIngestionPartition,
                  OnIngestionLegalTags: environment.settings.eds.legal,
                  OnIngestionAcl: environment.settings.eds.acl,
                  Workflows: this.EDSWorkFlowList,
                  //  [
                  //     {
                  //         "Tag": "FETCH",
                  //         "Handler": "eds_ingest",
                  //         "SecuritySchemeName":"OAuth2_PasswordCredentials",
                  //         "Url": "https://api-demo3.mykdm.com/osdu-eds/v1/query"
                  //     }
                  // ]
                },
                acl: environment.settings.eds.acl,
                legal: environment.settings.eds.legal,
              },
            ],
          },
        },
      };

      console.log(data);

      // this.isPreview=true;
      // this.stepper.next()
      // }
    }
  }

  viewDataJob() {
    this.spinner.show();
    this.connectedSourceId = this.ngRegSource;
    this.getConnectionSourceDataJob();
    this.isViewDataJob = true;

    // this.openModalEdit('edit',this.ngDataJob);
  }

  previous() {
    this.router.navigate(['/EDS/source']);
    // this.stepper.previous()
  }

  resetForm(type) {
    if (type == 'full') {
      this.ngRegSource = '0';
    }
    this.ngSelectedIngestionPartition = '';
    this.ngSelectedJobID = '';
    this.ngSelectedJobName = '';
    this.ngSelectedSourcePartition = '';
    this.ngSelectedUTC = '';
    this.ngSelectedFetchKind = '';
    this.ngFetchFilter = '';
    this.ngJobActive = false;
    this.EDSWorkFlowList = [];
    this.ngDataJob = '0';
  }

  saveDataJob() {}
}
