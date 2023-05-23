import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { WfRunViewComponent } from '../wf-run-view/wf-run-view.component';
import { WorkflowRunDetailsComponent } from '../workflow-run-details/workflow-run-details.component';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';

@Component({
  selector: 'app-work-flow-run',
  templateUrl: './work-flow-run.component.html',
  styleUrls: ['./work-flow-run.component.css'],
})
export class WorkFlowRunComponent implements OnInit {
  error_Message_Div: any = '';
  pageSize = 10;
  myInput;
  page = 1;
  ngselectedWorkFlowName;
  workFlowNameList = [];
  workFlowRunList = [];
  fullWorkFlowRunList = [];
  currentWorkFlow = '';
  currentWorkFlowID = '';
  istoggle: boolean = false;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    let href = this.router.url;
    if (href.includes('?workflow')) {
      this.currentWorkFlow = href.split('?')[1].split('=')[1];
    } else {
      this.currentWorkFlow = '';
      this.ngselectedWorkFlowName;
    }

    console.log('router', this.currentWorkFlow);
    this.workFlowNameList = this.cmnSrvc.workFlowNameList;
    this.getWorkFlowList();
  }

  getWorkFlowList() {
    this.spinner.show();
    this.workFlowNameList = [];
    this.restService.getWorkFlowList().subscribe(
      (result) => {
        this.spinner.hide();
        this.workFlowNameList = result.map((x) => x.workflowName);
        this.cmnSrvc.workFlowNameList = result.map((x) => x.workflowName);
        this.error_Message_Div = '';
        if (this.currentWorkFlow != '') {
          this.ngselectedWorkFlowName = this.currentWorkFlow;
          this.showDataWorkFlow(this.currentWorkFlow);
        }
      },
      (err) => {
        this.error_Message_Div = err;
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  showDataWorkFlow(workflow) {
    this.spinner.show();
    this.workFlowRunList = [];
    this.restService.getAWorkFlowRun(workflow).subscribe(
      (result) => {
        this.spinner.hide();
        this.currentWorkFlowID = result[0].workflowId;
        this.currentWorkFlow = result[0].workflowName;
        this.workFlowRunList = result;
        this.fullWorkFlowRunList = result;
        this.error_Message_Div = '';
        console.log(result);
      },
      (err) => {
        this.error_Message_Div = err;
        this.spinner.hide();
        console.log(err);
      }
    );
  }
  searchFilter(search) {
    this.workFlowRunList = this.cmnSrvc.filterByValue(
      this.fullWorkFlowRunList,
      search
    );
  }

  sort(colName) {
    if (this.istoggle) {
      if (colName == 'startTimeStamp' || colName == 'endTimeStamp') {
        this.workFlowRunList.sort((a, b) => (a[colName] > b[colName] ? -1 : 1));
      } else {
        this.workFlowRunList.sort((a, b) =>
          a[colName].toLowerCase() > b[colName].toLowerCase() ? -1 : 1
        );
      }

      this.istoggle = !this.istoggle;
    } else {
      if (colName == 'startTimeStamp' || colName == 'endTimeStamp') {
        this.workFlowRunList.sort((a, b) => (a[colName] < b[colName] ? -1 : 1));
      } else {
        this.workFlowRunList.sort((a, b) =>
          a[colName].toLowerCase() < b[colName].toLowerCase() ? -1 : 1
        );
      }

      this.istoggle = !this.istoggle;
    }
  }

  styleStatus(status) {
    if (status == 'success' || status == 'finished') {
      return '#009959';
    } else if (status == 'failed') {
      return 'red';
    } else {
      return 'black';
    }
  }

  updateStatusFunc(run) {
    const modalRef = this.modalService.open(WfRunViewComponent);
    modalRef.componentInstance.runID = run.runId;
    modalRef.componentInstance.runName = run.workflowName;
    modalRef.componentInstance.runStatus = run.status;

    let that = this;
    modalRef.componentInstance.passEntryEdit.subscribe((result) => {
      that.workFlowRunList.forEach((element) => {
        if (element.runId == result.data.runId) {
          element.status = result.data.status;
        }
      });
    });
  }

  triggerRun() {
    const data = {
      executionContext: {
        key: 'value',
      },
    };

    let that = this;

    swal
      .fire(
        Helper.warningSweetAlertConfirmConfig(
          'Are you sure you want to continue a Workflow Trigger?'
        )
      )
      .then((result) => {
        if (!result.isConfirmed) return;

        that.spinner.show();

        that.restService
          .postTriggerWorkflowRun(that.currentWorkFlow, data)
          .subscribe(
            (result) => {
              that.spinner.hide();
              that.workFlowRunList.push({
                runId: result.runId,
                submittedBy: result.submittedBy,
                startTimeStamp: result.startTimeStamp,
                endTimeStamp: result.endTimeStamp,
                status: result.status,
              });

              swal.fire(
                Helper.sucessSweetAlertConfig(
                  'Workflow Run with runId ' +
                    result.runId +
                    ' created successfully.'
                )
              );

              console.log(result);
            },
            (err) => {
              that.error_Message_Div = err;
              that.spinner.hide();
              console.log(err);
            }
          );
      });
  }

  openModalRun(run) {
    const modalRef = this.modalService.open(WorkflowRunDetailsComponent);
    modalRef.componentInstance.runID = run.runId;
    // modalRef.componentInstance.runDetails=run;
    modalRef.componentInstance.workFlow = this.currentWorkFlow;
    let that = this;
    modalRef.componentInstance.passEntryEdit.subscribe((result) => {
      that.workFlowRunList.forEach((element) => {
        if (element.runId == result.data.runId) {
          element.status = result.data.status;
        }
      });
    });
  }
}
