import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';

@Component({
  selector: 'app-add-service-agreement',
  templateUrl: './add-service-agreement.component.html',
  styleUrls: ['./add-service-agreement.component.css'],
})
export class AddServiceAgreementComponent implements OnInit {
  @Output() passEntryAdd: EventEmitter<any> = new EventEmitter();
  ngServiceAgreementName = '';
  successMessge = '';
  errorMessge = '';
  isSuccess: boolean = false;
  isError: boolean = false;
  Type;
  btnName = '';
  AgreementName;
  ServiceAgreementList;
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
      this.ngServiceAgreementName = this.AgreementName;
      this.btnName = 'Save';
    }
  }

  closePopup() {
    this.activeModal.close();
  }
  requestSubmit() {
    if (this.Type == 'add') {
      if (this.ServiceAgreementList.includes(this.ngServiceAgreementName)) {
        this.isSuccess = false;
        this.isError = true;
        this.errorMessge = 'Service Agreement Already exists.';
        this.ngServiceAgreementName = '';
      } else {
        this.isSuccess = true;
        this.isError = false;
        this.passEntryAdd.emit({ data: this.ngServiceAgreementName });
        this.successMessge = 'Service Agreement added successfully.';
        this.ngServiceAgreementName = '';
      }
    } else {
      if (this.ServiceAgreementList.includes(this.ngServiceAgreementName)) {
        this.isSuccess = false;
        this.isError = true;
        this.errorMessge = 'Service Agreement Already exists.';
        this.ngServiceAgreementName = '';
      } else {
        this.isSuccess = true;
        this.isError = false;
        const data = {
          previous_name: this.AgreementName,
          new_name: this.ngServiceAgreementName,
        };
        this.passEntryAdd.emit({ data: data });
        this.successMessge = 'Service Agreement updated successfully.';
      }
    }
  }
}
