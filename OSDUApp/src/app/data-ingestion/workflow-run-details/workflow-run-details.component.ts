import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';

@Component({
  selector: 'app-workflow-run-details',
  templateUrl: './workflow-run-details.component.html',
  styleUrls: ['./workflow-run-details.component.css'],
})
export class WorkflowRunDetailsComponent implements OnInit {
  runID;
  runDetails = [];
  workFlowId;
  startTimeStamp;
  endTimeStamp;
  status;
  submittedBy;
  workFlow;

  successMessge = '';
  errorMessge = '';
  isSuccess: boolean = false;
  isError: boolean = false;

  @Output() passEntryEdit: EventEmitter<any> = new EventEmitter();
  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.getRunDetails();
  }

  getRunDetails() {
    this.restService.getAWorkFlowRunDetail(this.workFlow, this.runID).subscribe(
      (result) => {
        this.spinner.hide();
        if (typeof result == 'object') {
          this.isSuccess = true;
          this.isError = false;
          this.runDetails = result;
          this.workFlowId = result.workflowId;
          this.submittedBy = result.submittedBy;
          this.startTimeStamp = result.startTimeStamp;
          this.endTimeStamp = result.endTimeStamp;
          this.status = result.status;
        } else {
          this.isSuccess = false;
          this.isError = true;
          this.errorMessge = result;
        }
      },
      (err) => {
        this.isError = true;
        this.isSuccess = false;
        this.errorMessge = err;
        this.spinner.hide();
      }
    );
  }

  closePopup() {
    this.activeModal.close();
  }

  requestSubmit() {
    const data = {
      status: this.status,
    };
    const outputParam = {
      status: this.status,
      runId: this.runID,
    };
    if (this.status == '') {
      this.isError = true;
      this.isSuccess = false;
      this.errorMessge = 'Please enter a value for status.';
    } else {
      this.spinner.show();
      this.restService
        .updateWorkFlowRunStatus(this.workFlow, this.runID, data)
        .subscribe(
          (result) => {
            this.spinner.hide();
            if (typeof result == 'object') {
              this.isSuccess = true;
              this.isError = false;
              this.successMessge = 'Successfully updated the status.';
              this.passEntryEdit.emit({ data: outputParam });
            } else {
              this.isError = true;
              this.isSuccess = false;
              this.errorMessge = result;
            }
          },
          (err) => {
            this.isError = true;
            this.isSuccess = false;
            this.errorMessge = err;
            this.spinner.hide();
          }
        );
    }
  }
}
