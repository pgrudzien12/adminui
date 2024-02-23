import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common/common.service';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';
import { ConnectorService } from 'src/app/common/connector.service';
@Component({
  selector: 'app-ref-data-main',
  templateUrl: './ref-data-main.component.html',
  styleUrls: ['./ref-data-main.component.css'],
})
export class RefDataMainComponent implements OnInit {
  errorMessage: string = '';
  isAuthorized: boolean = false;
  myInput;
  modalOptions: NgbModalOptions;
  resultRefSearchQuery = [];
  resultRefSearchQueryFilter = [];
  searchReferenceRequest;
  resultRefSearchQueryCount = 0;
  loading: boolean = true;
  storageKindList = [];

  constructor(
    private router: Router,
    public cmnSrvc: CommonService,
    private restService: RestAPILayerService,
    private spinner: NgxSpinnerService,
    private connectorService: ConnectorService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
    this.cmnSrvc.bkgndColor = 'RefData';
  }

  ngOnInit(): void {
    this.loading = true;
    if (this.cmnSrvc.storageKindList == undefined) {
      this.getSchemaKind();
    } else if (this.storageKindList.length == 0) {
      this.storageKindList = this.cmnSrvc.storageKindList.filter((x) =>
        x.schemaIdentity.id.startsWith('osdu:wks:reference-data--')
      );
    }
    this.searchReferenceRequest = this.cmnSrvc.referenceQuery;
    if (this.searchReferenceRequest != undefined) {
      this.getObjectsByKind(this.searchReferenceRequest);
    } else {
      this.loading = false;
    }
  }

  getSchemaKind() {
    this.spinner.show();

    this.restService.getSchemaKindList().subscribe(
      (result) => {
        this.spinner.hide();
        this.isAuthorized = true;
        if (typeof result != 'string') {
          this.cmnSrvc.storageKindList = result['schemaInfos'];
          this.storageKindList = this.cmnSrvc.storageKindList.filter((x) =>
            x.schemaIdentity.id.startsWith('osdu:wks:reference-data--')
          );
          this.cmnSrvc.storageKindList;
        }
      },
      (err) => {
        this.spinner.hide();
        this.isAuthorized = false;
        if (err.error != undefined) {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = err;
        }
      }
    );
  }

  searchFilter(search) {
    this.resultRefSearchQueryFilter = this.cmnSrvc.filterByValue(
      this.resultRefSearchQuery,
      search
    );
    this.resultRefSearchQueryCount = this.resultRefSearchQueryFilter.length;
  }

  openModalObjectView(objId) {
    this.router.navigate(['/object-view', objId]);
  }

  getObjectsByKind(kind) {
    this.cmnSrvc.referenceQuery = kind;
    this.connectorService.getObjectsByKind(kind).subscribe(
      (resultSearchQuery) => {
        this.resultRefSearchQuery = resultSearchQuery['results'];
        this.resultRefSearchQueryFilter = resultSearchQuery['results'];
        this.resultRefSearchQueryCount = resultSearchQuery['results'].length;
        this.spinner.hide();
        this.loading = false;
      },
      (err) => {
        swal.fire(Helper.errorSweetAlertConfig(err));
        this.spinner.hide();
      }
    );
  }
}
