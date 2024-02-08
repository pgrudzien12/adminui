import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';

@Component({
  selector: 'app-wf-run-view',
  templateUrl: './wf-run-view.component.html',
  styleUrls: ['./wf-run-view.component.css'],
})
export class WfRunViewComponent implements OnInit {
  runID;
  runName;
  ngWellRunStatus;
  runStatus;
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
    this.ngWellRunStatus = this.runStatus;
  }

  requestSubmit() {
    this.spinner.show();
    const data = {
      status: this.ngWellRunStatus,
    };
    const outputParam = {
      status: this.ngWellRunStatus,
      runId: this.runID,
    };
    this.restService
      .updateWorkFlowRunStatus(this.runName, this.runID, data)
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

  closePopup() {
    this.activeModal.close();
  }
}
