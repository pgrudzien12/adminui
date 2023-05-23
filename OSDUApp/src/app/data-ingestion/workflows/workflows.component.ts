import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { CreateWorkflowComponent } from '../create-workflow/create-workflow.component';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.css'],
})
export class WorkflowsComponent implements OnInit {
  error_Message_Div: any = '';
  pageSize = 10;
  myInput;
  page = 1;
  headers;
  istoggle: boolean = false;
  workFlowList = [];
  fullWorkFlowList = [];
  constructor(
    private router: Router,
    private modalService: NgbModal,
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getWorkFlowList();
  }

  getWorkFlowList() {
    this.spinner.show();
    this.restService.getWorkFlowList().subscribe(
      (result) => {
        this.spinner.hide();
        this.workFlowList = result;
        this.fullWorkFlowList = result;
        this.cmnSrvc.workFlowNameList = result.map((x) => x.workflowName);
        console.log(result);
      },
      (err) => {
        this.error_Message_Div = err;
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  openModalCreate() {
    const modalRef = this.modalService.open(CreateWorkflowComponent);
    modalRef.componentInstance.passEntryAdd.subscribe();
  }

  searchFilter(search) {
    this.workFlowList = this.cmnSrvc.filterByValue(
      this.fullWorkFlowList,
      search
    );
  }

  sort(colName) {
    if (this.istoggle) {
      if (colName == 'creationTimestamp') {
        this.workFlowList.sort((a, b) => (a[colName] > b[colName] ? -1 : 1));
      } else {
        this.workFlowList.sort((a, b) =>
          a[colName].toLowerCase() > b[colName].toLowerCase() ? -1 : 1
        );
      }

      this.istoggle = !this.istoggle;
    } else {
      if (colName == 'creationTimestamp') {
        this.workFlowList.sort((a, b) => (a[colName] < b[colName] ? -1 : 1));
      } else {
        this.workFlowList.sort((a, b) =>
          a[colName].toLowerCase() < b[colName].toLowerCase() ? -1 : 1
        );
      }

      this.istoggle = !this.istoggle;
    }
  }

  openWorkFlowRun(workflow) {
    this.router.navigate(['/data-ingestion/workflowRun'], {
      queryParams: { workflow: workflow.workflowName },
    });
  }

  deleteFunc(workflowname) {
    this.spinner.show();
    this.restService.deleteWorkflowNAme(workflowname).subscribe(
      (result) => {
        this.spinner.hide();
        this.workFlowList = this.workFlowList.filter(
          (x) => x.workflowName != workflowname
        );

        console.log(result);
      },
      (err) => {
        this.error_Message_Div = err;
        this.spinner.hide();
        console.log(err);
      }
    );
  }
}
