import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { AddWorkflowParameterComponent } from '../add-workflow-parameter/add-workflow-parameter.component';

@Component({
  selector: 'app-add-datajob-workflow',
  templateUrl: './add-datajob-workflow.component.html',
  styleUrls: ['./add-datajob-workflow.component.css'],
})
export class AddDatajobWorkflowComponent implements OnInit {
  @Output() passEntryWorkFlow: EventEmitter<any> = new EventEmitter();

  ngSelectedTag = '';
  ngSelectedHandler = '';
  ngParameters = '0';
  ngSelectedAccountName = '0';
  ngSelectedURL = '';
  btnLabel = '';

  ParameterList = [];

  isSuccess: boolean = false;
  isError: boolean = false;
  successMessge = '';
  errorMessge = '';

  Type;
  WorkFlowDetails;
  serviceAccountNameList;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  ngOnInit(): void {
    if (this.Type == 'add') {
      this.btnLabel = 'Add';
    } else {
      this.btnLabel = 'Save';
      this.ngSelectedTag = this.WorkFlowDetails.Tag;
      this.ngSelectedHandler = this.WorkFlowDetails.Handler;
      this.ngSelectedURL = this.WorkFlowDetails.URL;
      this.ngSelectedAccountName = this.WorkFlowDetails.ServiceAccountName;
      if (this.WorkFlowDetails.Parameters.length > 0) {
        this.ParameterList = this.WorkFlowDetails.Parameters;
      }
    }
  }
  closePopup() {
    this.activeModal.close();
  }

  requestSubmit() {
    let count = 0;
    if (this.ngSelectedTag == '') {
      count += 1;
    }
    if (this.ngSelectedAccountName == '0') {
      count += 1;
    }

    if (count > 0) {
      this.isError = true;
      this.isSuccess = false;
      this.errorMessge = 'Please fill all the requied fields.';
    } else {
      this.isError = false;
      this.isSuccess = true;
      if (this.Type == 'add') {
        this.successMessge = 'Work Flow has been added successfully.';
        const data = {
          Tag: this.ngSelectedTag,
          Handler: this.ngSelectedHandler,
          Parameters: this.ParameterList,
          URL: this.ngSelectedURL,
          ServiceAccountName: this.ngSelectedAccountName,
        };
        this.passEntryWorkFlow.emit({ data: data });
      } else {
        this.successMessge = 'Service Account has been updated successfully.';
        const data = {
          PreviousTagName: this.WorkFlowDetails.Tag,
          Tag: this.ngSelectedTag,
          Handler: this.ngSelectedHandler,
          Parameters: this.ParameterList,
          URL: this.ngSelectedURL,
          ServiceAccountName: this.ngSelectedAccountName,
        };
        this.passEntryWorkFlow.emit({ data: data });
      }
    }
  }

  openModalAddParameter(type) {
    const modalRef = this.modalService.open(AddWorkflowParameterComponent);
    modalRef.componentInstance.Type = type;
    if (type == 'edit') {
      let selServiceList = this.ParameterList.filter(
        (x) => x.Name == this.ngParameters
      );
      modalRef.componentInstance.ParameterDetails = selServiceList;
    }
    let that = this;
    modalRef.componentInstance.passEntry.subscribe((result) => {
      if (type == 'add') {
        that.ParameterList.push({
          Name: result.data.Name,
          Value: result.data.Value,
        });
      } else {
        if (that.ngParameters != '0') {
          that.ParameterList.forEach((element) => {
            if (element.Name == result.data.PreviousName) {
              element.Name = result.data.Name;
              element.Value = result.data.Value;
            }
          });
          that.ngParameters = '0';
        }
      }
    });
  }
}
