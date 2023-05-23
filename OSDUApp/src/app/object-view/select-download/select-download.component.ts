import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { CommonService } from 'src/app/common/common.service';
import swal from 'sweetalert2';
import { Helper } from 'src/app/common/helper.service';
@Component({
  selector: 'app-select-download',
  templateUrl: './select-download.component.html',
  styleUrls: ['./select-download.component.css'],
})
export class SelectDownloadComponent implements OnInit {
  isSuccess: boolean;
  isError: boolean;
  successMessge: string;
  errorMessge = '';
  tabSelectedChoices;

  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  ngOnInit(): void {
    this.tabSelectedChoices = new Array(
      this.cmnSrvc.tabObjectFilesAssociated.names.length
    ).fill(true);
  }

  closePopup() {
    this.activeModal.close();
  }

  downloadAssociatedFiles() {
    this.cmnSrvc.progressionBarDownloadValue = 0;
    this.cmnSrvc.progressionBarDownloadText = 'Start downloading ...';
    let indexTrue = this.tabSelectedChoices.flatMap((bool, index) =>
      bool ? index : []
    );
    let urls = [];
    let names = [];
    for (let i in indexTrue) {
      urls.push(this.cmnSrvc.tabObjectFilesAssociated.urls[indexTrue[i]]);
      names.push(this.cmnSrvc.tabObjectFilesAssociated.names[indexTrue[i]]);
    }

    if (urls.length < 1) {
      this.cmnSrvc.progressionBarDownloadText = '';

      swal.fire(
        Helper.errorSweetAlertConfig(
          'Please select at least one file to download'
        )
      );
    } else if (urls.length == 1) {
      this.restService.downloadURLSignedDirect(urls[0]);
      this.cmnSrvc.progressionBarDownloadText = '';
    } else {
      try {
        this.restService.downloadAsZip(urls, names);
      } catch (err) {
        swal.fire(Helper.errorSweetAlertConfig(err));
      }
    }
  }

  calculateAttributesFileSize() {
    let indexTrue = this.tabSelectedChoices.flatMap((bool, index) =>
      bool ? index : []
    );
    let totalSize = 0;
    for (let i in indexTrue) {
      totalSize +=
        this.cmnSrvc.tabObjectFilesAssociated.filesSize[indexTrue[i]];
    }

    return this.cmnSrvc.calculateAttributeFileSize(totalSize);
  }
}
