import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestAPILayerService } from 'src/app/common/rest-apilayer.service';
import { CommonService } from 'src/app/common/common.service';

@Component({
  selector: 'app-edit-legal-tags',
  templateUrl: './edit-legal-tags.component.html',
  styleUrls: ['./edit-legal-tags.component.css'],
})
export class EditLegalTagsComponent implements OnInit {
  legalDetails;

  legalName;
  successMessge = '';
  errorMessge = '';
  isSuccess: boolean = false;
  isError: boolean = false;
  selectedexpirationDate;
  @Output() passEntryEdit: EventEmitter<any> = new EventEmitter();
  @ViewChild('myForm', { static: true }) myForm: ElementRef;
  model: { year: number; month: number; day: number };

  constructor(
    public activeModal: NgbActiveModal,
    public cmnSrvc: CommonService,
    private spinner: NgxSpinnerService,
    public restService: RestAPILayerService
  ) {}

  ngOnInit(): void {
    this.legalTagDetails();
  }

  legalTagDetails() {
    this.spinner.show();
    this.restService.getALegalTagDetails(this.legalName).subscribe(
      (result) => {
        if (typeof result != 'string') {
          this.legalDetails = result;
          let expdate = result.properties.expirationDate;
          expdate = expdate.split('-');
          this.selectedexpirationDate = {
            year: parseInt(expdate[0]),
            month: parseInt(expdate[1]),
            day: parseInt(expdate[2]),
          };
          //this.selectedexpirationDate=this.model;
        }
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  requestSubmit() {
    this.spinner.show();
    const resetForm = <HTMLFormElement>document.getElementById('myForm');
    let month = '' + this.selectedexpirationDate['month'];
    if (month.length < 2) {
      month = '0' + month;
    }
    let day = '' + this.selectedexpirationDate['day'];
    if (day.length < 2) {
      day = '0' + day;
    }
    const expDate =
      this.selectedexpirationDate['year'] + '-' + month + '-' + day;

    const data = {
      name: this.legalDetails.name,
      contractId: resetForm.contractid.value,
      expirationDate: expDate,
      description: resetForm.description.value,
    };
    this.restService.updateLegalTag(data).subscribe(
      (result) => {
        this.spinner.hide();
        if (typeof result != 'string') {
          this.isSuccess = true;
          this.isError = false;
          this.successMessge = 'Legal Tag details updated successfully.';
          this.passEntryEdit.emit({ data: data });
        }
      },
      (err) => {
        this.isSuccess = false;
        this.isError = true;
        this.errorMessge = err;
        this.spinner.hide();
      }
    );
  }

  closePopup() {
    this.activeModal.close();
  }
}
