import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { edsList } from 'src/config';

@Component({
  selector: 'app-external-source-reg-preview',
  templateUrl: './external-source-reg-preview.component.html',
  styleUrls: ['./external-source-reg-preview.component.css'],
})
export class ExternalSourceRegPreviewComponent implements OnInit {
  SourceRegDetail;
  ServiceAccountHeader = [];

  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  ngOnInit(): void {
    this.cmnSrvc.sideNavLists = edsList;

    Object.keys(this.SourceRegDetail.data.ServiceAccounts).forEach(
      (element) => {
        this.ServiceAccountHeader.push(element);
      }
    );
  }

  closePopup() {
    this.activeModal.close();
  }
}
