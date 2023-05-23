import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';

@Component({
  selector: 'app-add-workflow-parameter',
  templateUrl: './add-workflow-parameter.component.html',
  styleUrls: ['./add-workflow-parameter.component.css'],
})
export class AddWorkflowParameterComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  ngSelectedWorkFlowName = '';
  ngSelectedWorkFlowValue = '';

  successMessge = '';
  errorMessge = '';
  isSuccess: boolean = false;
  isError: boolean = false;

  btnName = '';
  Type;
  ParameterDetails;

  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  ngOnInit(): void {
    if (this.Type == 'add') {
      this.btnName = 'Add';
    } else {
      this.btnName = 'Save';
      this.ngSelectedWorkFlowName = this.ParameterDetails[0].Name;
      this.ngSelectedWorkFlowValue = this.ParameterDetails[0].Value;
    }
  }

  closePopup() {
    this.activeModal.close();
  }

  requestSubmit() {
    let count = 0;
    for (let element in this) {
      if (element.includes('ngSelected')) {
        if (this[element].toString() === '') {
          count += 1;
        }
      }
    }

    if (count > 0) {
      this.isError = true;
      this.isSuccess = false;
      this.errorMessge = 'Please enter all the fields';
    } else {
      this.isError = false;
      this.isSuccess = true;
      if (this.Type == 'add') {
        this.successMessge = 'Parameter has been created successfully.';
        const data = {
          Name: this.ngSelectedWorkFlowName,
          Value: this.ngSelectedWorkFlowValue,
        };
        this.passEntry.emit({ data: data });
      } else {
        this.successMessge = 'Parameter has been updated successfully.';
        const data = {
          PreviousName: this.ParameterDetails[0].Name,
          Name: this.ngSelectedWorkFlowName,
          Value: this.ngSelectedWorkFlowValue,
        };
        this.passEntry.emit({ data: data });
      }
    }
  }
}
