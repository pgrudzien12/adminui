import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';

@Component({
  selector: 'app-edit-service-acc',
  templateUrl: './edit-service-acc.component.html',
  styleUrls: ['./edit-service-acc.component.css'],
})
export class EditServiceAccComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  ServiceDetails;
  isSuccess: boolean = false;
  isError: boolean = false;
  successMessge = '';
  errorMessge = '';
  txtAccLabel = '';
  txtAccAuthType = '';
  txtAccName = '';
  txtSecretManKey = '';
  txtAuthEndpoint = '';

  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  ngOnInit(): void {
    if (this.ServiceDetails.length > 0) {
      this.txtAccLabel = this.ServiceDetails[0].AccountLabel;
      this.txtAccAuthType = this.ServiceDetails[0].AuthType;
      this.txtAccName = this.ServiceDetails[0].AccName;
      this.txtSecretManKey = this.ServiceDetails[0].SecManKey;
      this.txtAuthEndpoint = this.ServiceDetails[0].SerEndpoint;
    }
  }

  closePopup() {
    this.activeModal.close();
  }

  requestSubmit() {}
}
