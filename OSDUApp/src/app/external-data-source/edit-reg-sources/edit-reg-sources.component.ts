import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';

@Component({
  selector: 'app-edit-reg-sources',
  templateUrl: './edit-reg-sources.component.html',
  styleUrls: ['./edit-reg-sources.component.css'],
})
export class EditRegSourcesComponent {
  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  closePopup() {
    this.activeModal.close();
  }
  requestSubmit() {}
}
